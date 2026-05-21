# Runs silently on Windows login via Task Scheduler.
# Restores the saved PM2 process list (including webcraft dev server).
Set-Location -Path $PSScriptRoot
npx pm2 resurrect
