# Загрузка на https://github.com/arinaatom-cyber/OVARIANSIGNATURE
# Запустите ПОСЛЕ: gh auth login

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$remoteUrl = "https://github.com/arinaatom-cyber/OVARIANSIGNATURE.git"
$pagesUrl = "https://arinaatom-cyber.github.io/OVARIANSIGNATURE/"

Write-Host "=== Ovarian Signature Explorer -> OVARIANSIGNATURE ===" -ForegroundColor Cyan

gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nСначала войдите в GitHub:" -ForegroundColor Yellow
    Write-Host "  gh auth login" -ForegroundColor White
    exit 1
}

git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "Update docs and GitHub Pages target OVARIANSIGNATURE"
}

$remotes = git remote
if ($remotes -notcontains "origin") {
    git remote add origin $remoteUrl
} else {
    git remote set-url origin $remoteUrl
}

git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nГотово!" -ForegroundColor Green
    Write-Host "Репозиторий: $remoteUrl"
    Write-Host "`nВключите GitHub Pages:" -ForegroundColor Yellow
    Write-Host "  Settings -> Pages -> Branch: main, folder: /docs"
    Write-Host "Сайт: $pagesUrl"
} else {
    Write-Host "`nОшибка push. Проверьте gh auth login и доступ к репозиторию." -ForegroundColor Red
}
