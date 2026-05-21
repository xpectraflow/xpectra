# ==============================================================================
# Xpectra Premium Self-Hosting Installer (PowerShell — Windows)
# ==============================================================================
# This script will:
#   1. Verify Docker is installed and running
#   2. Auto-generate a secure .env configuration file
#   3. Check for local Python and Pip setup to install client SDK
#   4. Log you in to the private container registry
#   5. Boot the full Xpectra stack with docker compose
#   6. Open the dashboard in your browser automatically
#
# Run this script from PowerShell:
#   Set-ExecutionPolicy Bypass -Scope Process -Force; .\setup.ps1
# ==============================================================================

$ErrorActionPreference = "Stop"
$DASHBOARD_URL = "http://localhost:3000"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Clear-Host

Write-Host ""
Write-Host "                __   __               _                       " -ForegroundColor Cyan
Write-Host "                \ \ / /              | |                      " -ForegroundColor Cyan
Write-Host "                 \ V /_ __   ___  ___| |_ _ __ __ _           " -ForegroundColor Cyan
Write-Host "                  > <| '_ \ / _ \/ __| __| '__/ _` |          " -ForegroundColor Cyan
Write-Host "                 / . \ |_) |  __/ (__| |_| | | (_| |          " -ForegroundColor Cyan
Write-Host "                /_/ \_\ .__/ \___|\__|\__|_|  \__,_|          " -ForegroundColor Cyan
Write-Host "                      | |                                     " -ForegroundColor Cyan
Write-Host "                      |_|                                     " -ForegroundColor Cyan
Write-Host ""
Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "             Xpectra Premium Self-Hosting Suite — Setup (Windows)     " -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Helper to check if compose is available
function Get-ComposeCmd {
    $oldEAP = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $composeCmd = ""
    try {
        docker compose version > $null 2>&1
        if ($LASTEXITCODE -eq 0) {
            $composeCmd = "docker compose"
        }
    } catch {}
    
    if ([string]::IsNullOrEmpty($composeCmd)) {
        try {
            docker-compose --version > $null 2>&1
            if ($LASTEXITCODE -eq 0) {
                $composeCmd = "docker-compose"
            }
        } catch {}
    }
    $ErrorActionPreference = $oldEAP
    return $composeCmd
}

# ==============================================================================
# STEP 1: Verify Docker is installed
# ==============================================================================
Write-Host "[1/6] Checking for Docker..." -ForegroundColor Yellow

$DockerInstalled = $false
$oldEAP = $ErrorActionPreference
$ErrorActionPreference = "Continue"
try {
    $DockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        $DockerInstalled = $true
    }
} catch {}
$ErrorActionPreference = $oldEAP

if (-not $DockerInstalled) {
    Write-Host ""
    Write-Host "  ✗ Docker is not installed on this machine." -ForegroundColor Red
    Write-Host ""
    Write-Host "  Docker is a free tool that packages apps so they run identically" -ForegroundColor Cyan
    Write-Host "  on any computer — it's how Xpectra's services run." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  ──────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host "  → Install Docker Desktop for Windows:" -ForegroundColor Yellow
    Write-Host "    https://www.docker.com/products/docker-desktop/" -ForegroundColor Green
    Write-Host ""
    Write-Host "    1. Download and run the installer from the link above." -ForegroundColor White
    Write-Host "    2. Restart your computer if prompted." -ForegroundColor White
    Write-Host "    3. Open Docker Desktop from your Start Menu and wait for it to start." -ForegroundColor White
    Write-Host "    4. Re-run this script." -ForegroundColor White
    Write-Host "  ──────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    exit 1
}

$CleanVersion = (docker --version 2>/dev/null) -replace '^Docker version\s*', '' -replace ',\s*build\s*.*$', ''
Write-Host "  ✅ Docker found — version $CleanVersion" -ForegroundColor Green

# ==============================================================================
# STEP 2: Verify Docker daemon is running
# ==============================================================================
Write-Host ""
Write-Host "[2/6] Checking that Docker is running..." -ForegroundColor Yellow

$DockerRunning = $false
$oldEAP = $ErrorActionPreference
$ErrorActionPreference = "Continue"
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -eq 0) {
        $DockerRunning = $true
    }
} catch {}
$ErrorActionPreference = $oldEAP

if (-not $DockerRunning) {
    Write-Host ""
    Write-Host "  ✗ Docker is installed but not currently running." -ForegroundColor Red
    Write-Host ""
    Write-Host "  → Please open Docker Desktop from your Start Menu," -ForegroundColor Yellow
    Write-Host "    wait for the service to start, and then re-run this script." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    exit 1
}

Write-Host "  ✅ Docker daemon is running." -ForegroundColor Green

# ==============================================================================
# STEP 3: Verify Docker Compose is available
# ==============================================================================
$ComposeCmd = Get-ComposeCmd

if ([string]::IsNullOrEmpty($ComposeCmd)) {
    Write-Host ""
    Write-Host "  ✗ Docker Compose was not found." -ForegroundColor Red
    Write-Host ""
    Write-Host "  → Docker Compose is included by default in Docker Desktop." -ForegroundColor Yellow
    Write-Host "    Please ensure Docker Desktop is updated and working correctly." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    exit 1
}

Write-Host "  ✅ Docker Compose found — using '$ComposeCmd'." -ForegroundColor Green

# ==============================================================================
# STEP 4: Environment Configuration Setup (.env)
# ==============================================================================
Write-Host ""
Write-Host "[3/6] Configuring environment (.env)..." -ForegroundColor Yellow

$EnvFile = Join-Path $ScriptDir ".env"
$ExampleFile = Join-Path $ScriptDir ".env.example"

if (-not (Test-Path $EnvFile)) {
    if (Test-Path $ExampleFile) {
        Write-Host "  [+] Creating '.env' from '.env.example'..." -ForegroundColor Green
        Copy-Item $ExampleFile $EnvFile
        
        Write-Host "  [+] Generating cryptographically secure production keys..." -ForegroundColor Green
        
        # Generate clean base64 secret for NextAuth
        $NextAuthSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Min 0 -Max 256) }))
        
        # Generate random clean alphanumeric passwords
        function Get-RandomPassword {
            $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            return -join (1..24 | ForEach-Object { $chars[(Get-Random -Min 0 -Max $chars.Length)] })
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
        Write-Host "  ✅ Created .env with pre-seeded, randomly generated secure passwords!" -ForegroundColor Green
    } else {
        Write-Error "Could not find '.env.example' template inside: $ScriptDir"
    }
} else {
    Write-Host "  ✅ Existing '.env' configuration found. Skipping setup." -ForegroundColor Green
}

# ==============================================================================
# STEP 5: Client SDK Installation (xpectra-client)
# ==============================================================================
Write-Host ""
Write-Host "[4/6] Checking for local Python and Pip setup..." -ForegroundColor Yellow

$PythonInstalled = $false
$oldEAP = $ErrorActionPreference
$ErrorActionPreference = "Continue"
try {
    $Version = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $PythonInstalled = $true
        Write-Host "  ✅ Detected Python: $Version" -ForegroundColor Green
    }
} catch {}
$ErrorActionPreference = $oldEAP

if (-not $PythonInstalled) {
    Write-Host "  [!] Python was not detected in your system PATH." -ForegroundColor Red
    Write-Host "  [!] Skipping automatic SDK package installation." -ForegroundColor Yellow
    Write-Host "  [!] To install the SDK manually from GitHub, run:" -ForegroundColor Cyan
    Write-Host "      pip install git+https://github.com/xpectraflow/xpectra-client.git#subdirectory=python" -ForegroundColor DarkCyan
} else {
    Write-Host "  [*] Installing official xpectra-client SDK directly from GitHub..." -ForegroundColor Yellow
    
    # Use python -m pip to execute reliably under different environments
    python -m pip install "git+https://github.com/xpectraflow/xpectra-client.git#subdirectory=python"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Client SDK (xpectra-client) successfully installed on your Python runtime!" -ForegroundColor Green
    } else {
        Write-Host "  [!] Direct pip installation from GitHub failed with exit code $LASTEXITCODE." -ForegroundColor Red
        Write-Host "  [!] To try installing the SDK manually, run:" -ForegroundColor Cyan
        Write-Host "      pip install git+https://github.com/xpectraflow/xpectra-client.git#subdirectory=python" -ForegroundColor DarkCyan
    }
}

# ==============================================================================
# STEP 6: Authenticate with the Private Container Registry (GHCR)
# ==============================================================================
Write-Host ""
Write-Host "[5/6] Authenticating with the Xpectra container registry..." -ForegroundColor Yellow

# Check if already authenticated by attempting a lightweight pull
$AlreadyAuth = $false
$oldEAP = $ErrorActionPreference
$ErrorActionPreference = "Continue"
try {
    docker pull ghcr.io/xpectraflow/xpectra-web:latest > $null 2>$null
    if ($LASTEXITCODE -eq 0) {
        $AlreadyAuth = $true
    }
} catch {}
$ErrorActionPreference = $oldEAP

if ($AlreadyAuth) {
    Write-Host "  ✅ Already authenticated with the container registry." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "  Xpectra images are hosted in a secure private registry." -ForegroundColor Cyan
    Write-Host "  Please enter your premium Xpectra License Code to authenticate." -ForegroundColor Cyan
    Write-Host ""

    $LicenseCode = Read-Host "  Enter your Xpectra License Code" -AsSecureString
    $PlainToken = [System.Net.NetworkCredential]::new("", $LicenseCode).Password

    Write-Host ""
    $oldEAP = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    docker login ghcr.io -u xpectraflow-licensing -p $PlainToken > $null 2>$null
    $LoginExitCode = $LASTEXITCODE
    $ErrorActionPreference = $oldEAP

    if ($LoginExitCode -eq 0) {
        Write-Host "  ✅ Successfully authenticated with the container registry!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "  ✗ Authentication failed." -ForegroundColor Red
        Write-Host "    Please double-check your License Code and try again." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        exit 1
    }
}

# ==============================================================================
# STEP 7: Boot the Stack
# ==============================================================================
Write-Host ""
Write-Host "[6/6] Pulling images and booting Xpectra..." -ForegroundColor Yellow
Write-Host "  (This may take a few minutes on first run while images download)" -ForegroundColor Cyan
Write-Host ""

if ($ComposeCmd -eq "docker compose") {
    docker compose pull
    docker compose up -d
} else {
    & $ComposeCmd pull
    & $ComposeCmd up -d
}

Write-Host ""
Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 Xpectra is live!" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Dashboard URL :  $DASHBOARD_URL" -ForegroundColor White
Write-Host "  Login email   :  Check XPECTRA_INIT_USER_EMAIL in your .env" -ForegroundColor White
Write-Host "  Login password:  Check XPECTRA_INIT_USER_PASSWORD in your .env" -ForegroundColor White
Write-Host ""
Write-Host "  Tip: Run '$ComposeCmd logs -f xpectra-web' to watch startup logs." -ForegroundColor Cyan
Write-Host ""

# ==============================================================================
# STEP 8: Auto-open browser
# ==============================================================================
Write-Host "Opening the dashboard in your browser..." -ForegroundColor Yellow
try {
    Start-Process $DASHBOARD_URL
} catch {
    Write-Host "  [!] Could not open default browser automatically." -ForegroundColor Yellow
    Write-Host "      Please visit $DASHBOARD_URL manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan