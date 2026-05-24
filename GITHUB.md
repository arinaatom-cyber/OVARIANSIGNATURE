# Как выложить на GitHub

## 1. Создайте репозиторий

На https://github.com/new — имя, например: `ovarian-signature-explorer`

## 2. Загрузите код

```powershell
cd "C:\Users\Arina1996\Desktop\премии\ovarian-signature-explorer"
git remote add origin https://github.com/ВАШ_ЛОГИН/ovarian-signature-explorer.git
git commit -m "Initial commit: Ovarian Signature Explorer MVP"
git branch -M main
git push -u origin main
```

## 3. Включите GitHub Pages

Repository → **Settings** → **Pages** → Source: **Deploy from branch** → Branch **main**, folder **`/docs`** → Save.

Через 2–5 минут сайт: `https://ВАШ_ЛОГИН.github.io/ovarian-signature-explorer/`

## 4. Локальный просмотр

```powershell
cd docs
python -m http.server 8080
```

http://localhost:8080

## 5. Дальше

- Загрузить полный TSV 1649 кандидатов в `data/`
- Запустить `scripts/sync_data.py` (скопирует JSON в `docs/data/`)
- Добавить полный список 371 белка плазмы в `proteins_crosswalk.json`
