# -*- coding: utf-8 -*-
"""ROC SVM RBF, 5-fold CV на объединённой когорте PRIDE (4 проекта, n=180)."""
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

plt.rcParams.update(
    {
        "font.family": "sans-serif",
        "font.sans-serif": ["Inter", "Segoe UI", "DejaVu Sans", "Arial", "Helvetica"],
        "axes.titlesize": 13,
        "axes.labelsize": 12,
        "legend.fontsize": 9,
        "xtick.labelsize": 10,
        "ytick.labelsize": 10,
    }
)
import pandas as pd
from sklearn.metrics import auc, roc_auc_score, roc_curve
from sklearn.model_selection import StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

RANDOM_STATE = 42
ROOT = Path(__file__).resolve().parents[1]
MATRIX_CANDIDATES = [
    ROOT.parent / "Машинка Арина" / "Машинка Арина" / "matrix_after_project_zscore_no_imputation.xlsx",
    Path(r"C:\Users\Arina1996\Desktop\Машинка Арина\Машинка Арина\matrix_after_project_zscore_no_imputation.xlsx"),
]
OUT = ROOT / "images" / "ml_tissue_svm_rbf_roc.png"
OUT_DOCS = ROOT / "docs" / "images" / "ml_tissue_svm_rbf_roc.png"


def find_matrix() -> Path:
    for p in MATRIX_CANDIDATES:
        if p.exists():
            return p
    raise FileNotFoundError("matrix_after_project_zscore_no_imputation.xlsx not found")


def load_pride_xy(matrix_path: Path):
    df = pd.read_excel(matrix_path, sheet_name="matrix_after_project_z")
    ann = pd.read_excel(matrix_path, sheet_name="sample_annotation")
    meta = ["Protein IDs", "Gene names", "Protein names", "Majority protein IDs"]
    sample_cols = [c for c in df.columns if c not in meta]
    X = df[sample_cols].apply(pd.to_numeric, errors="coerce").T
    complete = ~X.isna().any(axis=0)
    X = X.loc[:, complete]
    ann2 = ann.set_index("SampleColumn").reindex(X.index)
    y = (ann2["Status"].astype(str) == "Cancer").astype(int).values
    projects = ann2["Project"].value_counts().to_dict()
    return X.values, y, projects


def plot_svm_rbf_roc(X, y, out_path: Path):
    model = Pipeline(
        [
            ("scaler", StandardScaler()),
            ("clf", SVC(kernel="rbf", C=1.0, class_weight="balanced", probability=True, random_state=RANDOM_STATE)),
        ]
    )
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    fold_aucs = []
    fig, ax = plt.subplots(figsize=(7.2, 6.2))
    cmap = plt.cm.Blues(np.linspace(0.45, 0.95, 5))

    for i, (train_idx, test_idx) in enumerate(cv.split(X, y), start=1):
        est = model
        est.fit(X[train_idx], y[train_idx])
        proba = est.predict_proba(X[test_idx])[:, 1]
        fpr, tpr, _ = roc_curve(y[test_idx], proba)
        fold_auc = roc_auc_score(y[test_idx], proba)
        fold_aucs.append(fold_auc)
        ax.plot(fpr, tpr, color=cmap[i - 1], lw=2, label=f"Fold {i} ({fold_auc:.3f})")

    mean_auc = float(np.mean(fold_aucs))
    std_auc = float(np.std(fold_aucs))
    ax.plot([0, 1], [0, 1], "k--", lw=1, alpha=0.5)
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate")
    ax.set_title(f"SVM_RBF — ROC\nAUC={mean_auc:.3f}±{std_auc:.3f}")
    ax.legend(loc="lower right", fontsize=9)
    ax.grid(alpha=0.25)
    ax.set_xlim(-0.02, 1.02)
    ax.set_ylim(-0.02, 1.02)
    fig.tight_layout()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out_path, dpi=200, bbox_inches="tight")
    plt.close(fig)
    return mean_auc, std_auc, fold_aucs


def main():
    matrix_path = find_matrix()
    X, y, projects = load_pride_xy(matrix_path)
    mean_auc, std_auc, folds = plot_svm_rbf_roc(X, y, OUT)
    plot_svm_rbf_roc(X, y, OUT_DOCS)
    print(f"samples={X.shape[0]}, features={X.shape[1]}")
    print("projects:", projects)
    print(f"AUC mean={mean_auc:.3f} std={std_auc:.3f} folds={folds}")


if __name__ == "__main__":
    main()
