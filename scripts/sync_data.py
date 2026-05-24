# -*- coding: utf-8 -*-
"""Копирует data/*.json → docs/data/ для GitHub Pages."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
src = ROOT / "data"
dst = ROOT / "docs" / "data"
dst.mkdir(parents=True, exist_ok=True)
for f in src.glob("*.json"):
    shutil.copy2(f, dst / f.name)
    print("copied", f.name)
print("Done:", dst)
