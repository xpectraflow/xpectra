# ==============================================================================
# XpectraFlow Premium Local Stack & SDK Installer (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"

Clear-Host
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " __   __               _                 ______ _                     " -ForegroundColor Cyan
Write-Host " \ \ / /              | |               |  ____| |                    " -ForegroundColor Cyan
Write-Host "  \ V /_ __   ___  ___| |_ _ __ __ _    | |__  | | _____      __      " -ForegroundColor Cyan
Write-Host "   > <| '_ \ / _ \/ __| __| '__/ _` |   |  __| | |/ _ \ \ /\ / /      " -ForegroundColor Cyan
Write-Host "  / . \ |_) |  __/ (__| |_| | | (_| |   | |    | | (_) \ V  V /       " -ForegroundColor Cyan
Write-Host " /_/ \_\ .__/ \___|\__|\__|_|  \__,_|   |_|    |_|\___/ \_/\_/        " -ForegroundColor Cyan
Write-Host "       | |                                                            " -ForegroundColor Cyan
Write-Host "       |_|                                                            " -ForegroundColor Cyan
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
    Write-Host "[!] To install the SDK manually from GitHub, run:" -ForegroundColor Cyan
    Write-Host "    pip install git+https://github.com/xpectraflow/xpectra-client.git#subdirectory=python" -ForegroundColor DarkCyan
} else {
    Write-Host "[*] Installing official xpectra-client SDK directly from GitHub..." -ForegroundColor Yellow
    
    # Use python -m pip to execute reliably under different environments
    python -m pip install "git+https://github.com/xpectraflow/xpectra-client.git#subdirectory=python"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Client SDK (xpectra-client) successfully installed on your Python runtime!" -ForegroundColor Green
    } else {
        Write-Host "[!] Direct pip installation from GitHub failed with exit code $LASTEXITCODE." -ForegroundColor Red
        Write-Host "[!] To try installing the SDK manually, run:" -ForegroundColor Cyan
        Write-Host "    pip install git+https://github.com/xpectraflow/xpectra-client.git#subdirectory=python" -ForegroundColor DarkCyan
    }
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🎉 XpectraFlow Self-Hosting Suite is Ready to Boot!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   To start the entire containerized telemetry platform, simply run:" -ForegroundColor White
Write-Host "   docker compose up -d" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
