/* Ovarian Signature Explorer — MVP */
const DATA = {
  subtypes: null,
  review: null,
  plasma: null,
  tissue: null,
  crosswalk: null,
};

async function loadJson(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(path);
  return r.json();
}

async function init() {
  const [subtypes, review, plasma, tissue, crosswalk] = await Promise.all([
    loadJson("data/subtypes.json"),
    loadJson("data/review.json"),
    loadJson("data/plasma.json"),
    loadJson("data/tissue.json"),
    loadJson("data/proteins_crosswalk.json"),
  ]);
  DATA.subtypes = subtypes;
  DATA.review = review;
  DATA.plasma = plasma;
  DATA.tissue = tissue;
  DATA.crosswalk = crosswalk;

  setupNav();
  renderSubtypes();
  renderPlasma();
  renderTissue();
  setupSearch();

  const hgsc = subtypes.subtypes.find((s) => s.id === "HGSC");
  if (hgsc) selectSubtype(hgsc);
}

function setupNav() {
  document.querySelectorAll("#levelNav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#levelNav button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const level = btn.dataset.level;
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      document.getElementById(`panel-${level}`).classList.add("active");
    });
  });
}

function renderSubtypes() {
  const grid = document.getElementById("subtypeGrid");
  grid.innerHTML = "";
  DATA.subtypes.subtypes.forEach((st) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "subtype-btn" + (st.focus ? " focus-type" : "");
    btn.innerHTML = `<strong>${st.name}</strong> <span class="share">${st.share_pct}%</span>`;
    btn.addEventListener("click", () => selectSubtype(st));
    grid.appendChild(btn);
  });
}

function selectSubtype(st) {
  const el = document.getElementById("subtypeDetail");
  const r = DATA.review;

  if (st.id === "HGSC") {
    el.innerHTML = `
      <h3>${st.name} — фокус проекта</h3>
      <p>${st.molecular}</p>
      <p><em>${st.clinical}</em></p>
      <hr style="border-color:var(--border)" />
      <h3>Уровень 1 · Систематический обзор</h3>
      <p><span class="stat-pill">PROSPERO ${r.prospero}</span>
         <span class="stat-pill">${r.publications_screened} публикаций</span>
         <span class="stat-pill">${r.candidates_total} кандидатов</span>
         <span class="stat-pill">HGSC: ${r.hgsc_genes} генов</span></p>
      <ul>${r.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
      <p>PMconv: ${r.pmconv_metabolites} метаболитов → <strong>${r.pmconv_proteins}</strong> белков путей</p>
      <p>DOI обзора: <a href="https://doi.org/${r.doi_review}" target="_blank" rel="noopener">${r.doi_review}</a></p>
      <p style="margin-top:1rem;color:var(--accent)">→ Вкладки «② Плазма» и «③ Ткань + ML»</p>
    `;
    renderReviewFigures(r);
  } else {
    document.getElementById("reviewFigures").classList.add("hidden");
    document.getElementById("reviewFigures").innerHTML = "";
    el.innerHTML = `
      <h3>${st.name}</h3>
      <p><strong>Доля ЭРЯ:</strong> ${st.share_pct}%</p>
      <p><strong>Молекулярно:</strong> ${st.molecular}</p>
      <p><strong>Клиника:</strong> ${st.clinical}</p>
      <p class="placeholder" style="margin-top:1rem">В обзоре 1649 кандидатов для этого подтипа — единичные публикации. Основной эксперимент и ML сфокусированы на <strong>HGSC</strong>.</p>
    `;
  }
}

function renderReviewFigures(r) {
  const box = document.getElementById("reviewFigures");
  box.classList.remove("hidden");
  const tops = (r.top_markers || [])
    .map((m) => `<tr><td>${m.gene}</td><td>${m.uniprot || "—"}</td><td>${m.count}</td></tr>`)
    .join("");
  const v = r.venn_four_db || {};
  const d = r.venn_disgenet || {};
  const paths = (r.pathways_hgsc || [])
    .map((p) => `<li><strong>${p.term}</strong> (${p.category}) — score ${p.score}, <em>p</em> ${p.p}</li>`)
    .join("");
  box.innerHTML = `
    <h3>Данные обзора (IJMS 2025)</h3>
    <div class="fig-grid">
      <div class="fig-card">
        <h4>Топ маркёров в обзоре</h4>
        <table class="mini-table"><thead><tr><th>Ген</th><th>UniProt</th><th>n статей</th></tr></thead><tbody>${tops}</tbody></table>
      </div>
      <div class="fig-card">
        <h4>Пересечение с базами</h4>
        <p>DisGeNET ∩ обзор: <strong>${d.overlap}</strong> из ${d.disgenet_reviewed} / ${d.review_markers}</p>
        <p>Все 4 источника: <strong>${v.all_four}</strong></p>
        <p>Только в обзоре (новые): <strong>${v.unique_to_review}</strong></p>
      </div>
      <div class="fig-card fig-wide">
        <h4>Обогащение путей HGSC (${r.hgsc_genes} генов)</h4>
        <ul class="path-list">${paths}</ul>
      </div>
    </div>`;
}

function renderPlasma() {
  const p = DATA.plasma;
  document.getElementById("plasmaIntro").textContent =
    `Когорта HGSC стадий I–III, контроль n=${p.cohort.controls}. PRIDE: ${p.pride_id}. Диапазон: ${p.detection_range}.`;

  const cards = document.getElementById("methodCards");
  cards.innerHTML = p.methods
    .map(
      (m) => `
    <div class="method-card">
      <h4>${m.name}</h4>
      <div class="big">${m.proteins}</div>
      <div>белков</div>
      ${m.unique ? `<div>уникальных: ${m.unique}</div>` : ""}
      <div style="font-size:0.8rem;color:var(--muted);margin-top:0.5rem">${m.range} моль/л</div>
    </div>`
    )
    .join("");

  document.getElementById("plasmaStats").innerHTML = `
    <div class="stat-box"><div class="val">${p.total_unique}</div><div class="lbl">всего уникальных</div></div>
    <div class="stat-box"><div class="val">${p.afm_only_pct}%</div><div class="lbl">только АСМ/МС</div></div>
    <div class="stat-box"><div class="val">${p.roc.DDA}</div><div class="lbl">ROC DDA</div></div>
    <div class="stat-box"><div class="val">${p.roc.SRM}</div><div class="lbl">ROC SRM</div></div>
    <div class="stat-box"><div class="val">${p.roc.panel_8}</div><div class="lbl">панель 8 марк.</div></div>
  `;

  const v = p.venn || {};
  document.getElementById("plasmaVenn").innerHTML = `
    <h3>Пересечение методов (JPR 2025, Fig. 3)</h3>
    <p>DDA ${p.methods[0].proteins} · MRM ${p.methods[1].proteins} · АСМ/МС ${p.methods[2].proteins} · PMconv ${p.methods[3].proteins} → всего <strong>${p.total_unique}</strong> белков</p>
    <p>Общие для трёх протеомных платформ: <strong>${v.overlap_three_proteomic}</strong> · уникально АСМ/МС: <strong>${p.methods[2].unique}</strong> · PMconv: <strong>${p.methods[3].unique}</strong></p>
    <p><em>${v.note}</em></p>
  `;

  document.getElementById("novelBox").innerHTML = `
    <strong>Новые ассоциации с РЯ в плазме:</strong> ${p.novel_plasma.join(", ")}
    <br><strong>Иммуноглобулины (низкая специфичность):</strong> ${(p.novel_ig_peptides || []).join(", ")}
    <br><strong>Панель кандидатов:</strong> ${p.candidates_panel} белков · известные из литературы: ${(p.known_overlap_literature || []).join(", ")}
    <br><a href="https://doi.org/${p.doi}" target="_blank" rel="noopener">DOI ${p.doi}</a>
  `;
}

function renderTissue() {
  const t = DATA.tissue;
  let table = `<table><thead><tr><th>PRIDE</th><th>n</th><th>Матрикс</th><th>Платформа</th></tr></thead><tbody>`;
  t.projects.forEach((pr) => {
    table += `<tr><td><a href="https://www.ebi.ac.uk/pride/archive/projects/${pr.id}" target="_blank" rel="noopener">${pr.id}</a></td><td>${pr.n}</td><td>${pr.matrix}</td><td>${pr.platform}</td></tr>`;
  });
  table += "</tbody></table>";
  document.getElementById("prideTable").innerHTML = table;

  document.getElementById("tissueStats").innerHTML = `
    <div class="stat-box"><div class="val">${t.samples_total}</div><div class="lbl">образцов</div></div>
    <div class="stat-box"><div class="val">${t.core_proteins.selected}</div><div class="lbl">core белков</div></div>
    <div class="stat-box"><div class="val">${t.universal_markers}</div><div class="lbl">universal</div></div>
    <div class="stat-box"><div class="val">0,984</div><div class="lbl">LOPO AUROC</div></div>
  `;

  document.getElementById("priorityChips").innerHTML = t.priority_markers
    .map((g) => `<span class="chip">${g}</span>`)
    .join("");

  document.getElementById("pathList").innerHTML = t.pathways.map((p) => `<li>${p}</li>`).join("");
}

function setupSearch() {
  const run = () => {
    const q = document.getElementById("geneInput").value.trim().toUpperCase();
    const box = document.getElementById("searchResult");
    if (!q) {
      box.innerHTML = '<p class="placeholder">Введите символ гена</p>';
      return;
    }
    const hit = DATA.crosswalk.proteins.find((p) => p.gene === q);
    if (!hit) {
      box.innerHTML = `<p>Ген <strong>${q}</strong> не в демо-наборе. Добавьте в <code>data/proteins_crosswalk.json</code> или загрузите полный список 371/1649.</p>`;
      return;
    }
    const yn = (v) => (v ? '<span class="tag-yes">да</span>' : '<span class="tag-no">нет</span>');
    box.innerHTML = `
      <h3>${hit.gene}</h3>
      <p>${hit.note || ""}</p>
      <table style="width:100%;margin-top:0.75rem;font-size:0.9rem">
        <tr><td>Обзор 1649</td><td>${yn(hit.review)}</td></tr>
        <tr><td>Плазма</td><td>${yn(hit.plasma)}</td></tr>
        <tr><td>Новый в плазме</td><td>${yn(hit.plasma_novel)}</td></tr>
        <tr><td>9 приоритетных (ткань)</td><td>${yn(hit.tissue_priority)}</td></tr>
        <tr><td>194 universal</td><td>${yn(hit.tissue_universal)}</td></tr>
      </table>
    `;
  };
  document.getElementById("searchBtn").addEventListener("click", run);
  document.getElementById("geneInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") run();
  });
}

init().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML(
    "beforeend",
    `<p style="padding:2rem;color:#f88">Ошибка загрузки данных. Запустите локальный сервер: python -m http.server 8080 --directory docs</p>`
  );
});
