# GitHub: OVARIANSIGNATURE

Репозиторий: **https://github.com/arinaatom-cyber/OVARIANSIGNATURE**

## Загрузка кода (один раз)

```powershell
cd "C:\Users\Arina1996\Desktop\премии\ovarian-signature-explorer"
gh auth login
.\push_to_github.ps1
```

Или вручную:

```powershell
git remote add origin https://github.com/arinaatom-cyber/OVARIANSIGNATURE.git
git branch -M main
git push -u origin main
```

## GitHub Pages (постоянный сайт)

1. Откройте репозиторий → **Settings** → **Pages**
2. **Deploy from branch** → ветка **main**, папка **`/docs`** → **Save**
3. Через 2–5 минут сайт:

**https://arinaatom-cyber.github.io/OVARIANSIGNATURE/**

## Локально

```powershell
cd docs
python -m http.server 8765
```

http://localhost:8765 — или двойной щелчок `ОТКРЫТЬ_САЙТ.bat`
