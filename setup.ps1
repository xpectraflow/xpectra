# ==============================================================================
# XpectraFlow Premium Local Stack & SDK Installer (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"

Clear-Host
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "             _  __                    _               ___  _          " -ForegroundColor Cyan
Write-Host "            | |/ /                   | |             / _ \| |         " -ForegroundColor Cyan
Write-Host "            | ' /  _ __   ___   ___  | |_  _ __  __ _ | | | | |  ___ __  " -ForegroundColor Cyan
Write-Host "            |  <  | '_ \ / _ \ / __| | __|| '__|/ _` || | | | | / _ \\ \/" -ForegroundColor Cyan
Write-Host "            | . \ | |_) |  __/| (__  | |_ | |  | (_| || |_| | || (_) |>  <" -ForegroundColor Cyan
Write-Host "            |_|\_\| .__/ \___| \___|  \__||_|   \__,_| \__\_\_| \___//_/\_\" -ForegroundColor Cyan
Write-Host "                  | |                                                 " -ForegroundColor Cyan
Write-Host "                  |_|                                                 " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "               XpectraFlow Premium Self-Hosting Suite Setup            " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# ------------------------------------------------------------------------------
# 1. Environment Config Setup (.env)
# ------------------------------------------------------------------------------
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvFile = Join-Path $ScriptDir ".env"
$ExampleFile = Join-Path $ScriptDir ".env.example"

Write-Host "[*] Checking Environment Configuration..." -ForegroundColor Yellow

if (-not (Test-Path $EnvFile)) {
    if (Test-Path $ExampleFile) {
        Write-Host "[+] Creating '.env' from '.env.example'..." -ForegroundColor Green
        Copy-Item $ExampleFile $EnvFile
        
        # Auto-generate secure secrets
        Write-Host "[+] Generating cryptographically secure production keys..." -ForegroundColor Green
        
        # Generate clean base64 secret for NextAuth
        $NextAuthSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Min 0 -Max 256) }))
        
        # Generate random clean alphanumeric passwords
        function Get-RandomPassword {
            $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            return -join (1..20 | ForEach-Object { $chars[(Get-Random -Min 0 -Max $chars.Length)] })
        }
        
        $PgPass = Get-RandomPassword
        $RedisPass = Get-RandomPassword
        $MinioPass = Get-RandomPassword
        $AdminPass = Get-RandomPassword
        
        # Read file, replace values, write back
        $Content = Get-Content $EnvFile -Raw
        $Content = $Content -replace "changeme_some_ultra_secure_long_secret_phrase", $NextAuthSecret
        $Content = $Content -replace "choose_a_strong_database_password_here", $PgPass
        $Content = $Content -replace "choose_a_strong_redis_password_here", $RedisPass
        $Content = $Content -replace "choose_a_strong_minio_password_here", $MinioPass
        $Content = $Content -replace "choose_a_strong_admin_password_here", $AdminPass
        
        Set-Content $EnvFile $Content
        Write-Host "✅ Created .env with pre-seeded, randomly generated secure passwords!" -ForegroundColor Green
    } else {
        Write-Error "Could not find '.env.example' template inside: $ScriptDir"
    }
} else {
    Write-Host "✅ Existing '.env' configuration found. Skipping setup." -ForegroundColor Green
}

Write-Host ""

# ------------------------------------------------------------------------------
# 2. Client SDK Installation (xpectra-client)
# ------------------------------------------------------------------------------
Write-Host "[*] Searching for Local SDK (xpectra-client)..." -ForegroundColor Yellow

# Locate relative python client library path
$ClientPath = Resolve-Path (Join-Path $ScriptDir "..\xpectra-client\python") -ErrorAction SilentlyContinue

if ($null -ne $ClientPath -and (Test-Path $ClientPath)) {
    Write-Host "[+] Local SDK folder identified: $ClientPath" -ForegroundColor Green
    Write-Host "[*] Checking for local Python and Pip setup..." -ForegroundColor Yellow
    
    $PythonInstalled = $false
    try {
        $Version = python --version 2>&1
        if ($LastExitCode -eq 0) {
            $PythonInstalled = $true
            Write-Host "✅ Detected Python: $Version" -ForegroundColor Green
        }
    } catch {}
    
    if (-not $PythonInstalled) {
        Write-Host "[!] Python was not detected in your system PATH." -ForegroundColor Red
        Write-Host "[!] Skipping automatic SDK package installation." -ForegroundColor Yellow
        Write-Host "[!] To install the SDK manually, navigate to '$ClientPath' and run:" -ForegroundColor Cyan
        Write-Host "    pip install -e ." -ForegroundColor DarkCyan
    } else {
        Write-Host "[*] Running pip package installation in editable developer mode..." -ForegroundColor Yellow
        try {
            # Use python -m pip to execute reliably under different environments
            python -m pip install -e $ClientPath.Path
            Write-Host "✅ Client SDK (xpectra-client) successfully installed on your Python runtime!" -ForegroundColor Green
        } catch {
            Write-Host "[!] Automatic pip installation failed." -ForegroundColor Red
            Write-Host "[!] To try installing the SDK manually, run:" -ForegroundColor Cyan
            Write-Host "    pip install -e `"$($ClientPath.Path)`"" -ForegroundColor DarkCyan
        }
    }
} else {
    Write-Host "[!] Local SDK directory 'xpectra-client\python' not found." -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🎉 XpectraFlow Self-Hosting Suite is Ready to Boot!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   To start the entire containerized telemetry platform, simply run:" -ForegroundColor White
Write-Host "   docker compose up -d" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
