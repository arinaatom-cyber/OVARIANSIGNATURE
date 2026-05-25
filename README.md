# Ovarian Signature Explorer

Воспроизводимая интерактивная платформа молекулярных сигнатур гетерогенных опухолей на модели **высокозлокачественного серозного рака яичников (HGSC)**.

**ИБМХ РАН · УНУ «Авогадро»** · Гордеева А.И., Ключникова А.А., Ильгисонис Е.В.

## Уровни платформы

1. **Обзор** — карта подтипов ЭРЯ, база 1649 кандидатов (PROSPERO CRD420250614341), PMconv
2. **Плазма** — DDA-Shotgun, SRM, АСМ/МС (PXD068982)
3. **Ткань + ML** — PRIDE (4 проекта, n=180), LOPO AUROC 0,984, 9 приоритетных маркёров
4. **Поиск белка** — сквозной пересмотр: обзор → плазма → ткань

## Быстрый старт (локально)

```bash
cd ovarian-signature-explorer
python -m http.server 8080 --directory docs
```

Откройте: http://localhost:8080

## GitHub Pages

1. Создайте репозиторий на GitHub
2. Settings → Pages → Source: **Deploy from branch** → folder **`/docs`**
3. `git push` — сайт: **https://arinaatom-cyber.github.io/OVARIANSIGNATURE/**

Репозиторий: https://github.com/arinaatom-cyber/OVARIANSIGNATURE

## Структура

```
data/           # JSON — таблицы для визуализации
docs/           # статический сайт (GitHub Pages)
scripts/        # конвертация Excel → JSON (опционально)
```

## Публикации

- Kliuchnikova A. et al. Int. J. Mol. Sci. 2025, 26(13), 5961 — DOI [10.3390/ijms26135961](https://doi.org/10.3390/ijms26135961)
- Ilgisonis E.V. et al. J. Proteome Res. 2025, 24(12), 6203–6214 — DOI [10.1021/acs.jproteome.5c00758](https://doi.org/10.1021/acs.jproteome.5c00758)
- Gordeeva A.I. et al. BBA Proteins and Proteomics 2026 — DOI [10.1016/j.bbapap.2026.141127](https://doi.org/10.1016/j.bbapap.2026.141127)

## Лицензия

MIT — код сайта. Данные: см. первоисточники и PRIDE.
