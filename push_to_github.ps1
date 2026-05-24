# Загрузка Ovarian Signature Explorer на GitHub
# Запустите в PowerShell ПОСЛЕ: gh auth login

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$repoName = "ovarian-signature-explorer"

Write-Host "=== Ovarian Signature Explorer -> GitHub ===" -ForegroundColor Cyan

# Проверка gh
gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nСначала войдите в GitHub:" -ForegroundColor Yellow
    Write-Host "  gh auth login" -ForegroundColor White
    exit 1
}

git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "Update project files and docs"
}

# Создать репозиторий (публичный) и запушить
gh repo create $repoName --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    $user = gh api user -q .login
    Write-Host "`nГотово!" -ForegroundColor Green
    Write-Host "Репозиторий: https://github.com/$user/$repoName"
    Write-Host "`nВключите GitHub Pages:" -ForegroundColor Yellow
    Write-Host "  Settings -> Pages -> Branch: main, folder: /docs"
    Write-Host "Сайт будет: https://$user.github.io/$repoName/"
} else {
    Write-Host "`nЕсли репозиторий уже есть, выполните:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/ВАШ_ЛОГИН/$repoName.git"
    Write-Host "  git branch -M main"
    Write-Host "  git push -u origin main"
}
