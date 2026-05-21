#!/usr/bin/env bash
# ==============================================================================
# Xpectra Premium Self-Hosting Installer (Bash — Linux & macOS)
# ==============================================================================
# This script will:
#   1. Verify Docker is installed and running
#   2. Auto-generate a secure .env configuration file
#   3. Log you in to the private container registry
#   4. Boot the full Xpectra stack with docker compose
#   5. Open the dashboard in your browser automatically
# ==============================================================================
set -e

# ── Terminal Colors ─────────────────────────────────────────────────────────
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_URL="http://localhost:3000"

clear

echo -e "${CYAN}${BOLD}"
cat << 'EOF'
                __   __               _
                \ \ / /              | |
                 \ V /_ __   ___  ___| |_ _ __ __ _
                  > <| '_ \ / _ \/ __| __| '__/ _` |
                 / . \ |_) |  __/ (__| |_| | | (_| |
                /_/ \_\ .__/ \___|\__|\__|_|  \__,_|
                      | |
                      |_|
EOF
echo -e "${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}             Xpectra Premium Self-Hosting Suite — Setup               ${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════════════════════════${NC}"
echo ""

# ── Helper: open a URL in the default browser ────────────────────────────────
open_browser() {
    local url="$1"
    if command -v xdg-open > /dev/null 2>&1; then
        xdg-open "$url" > /dev/null 2>&1 &
    elif command -v open > /dev/null 2>&1; then
        open "$url"
    fi
}

# ── Helper: detect compose command (plugin vs legacy) ────────────────────────
get_compose_cmd() {
    if docker compose version > /dev/null 2>&1; then
        echo "docker compose"
    elif command -v docker-compose > /dev/null 2>&1; then
        echo "docker-compose"
    else
        echo ""
    fi
}

# ==============================================================================
# STEP 1: Verify Docker is installed
# ==============================================================================
echo -e "${YELLOW}${BOLD}[1/5] Checking for Docker...${NC}"

if ! command -v docker > /dev/null 2>&1; then
    echo ""
    echo -e "${RED}${BOLD}✗ Docker is not installed on this machine.${NC}"
    echo ""
    echo -e "${CYAN}Docker is a free tool that packages apps so they run identically"
    echo -e "on any computer — it's how XpectraFlow runs all its services.${NC}"
    echo ""

    OS="$(uname -s)"
    case "$OS" in
        Darwin)
            echo -e "${YELLOW}${BOLD}→ Install Docker Desktop for macOS:${NC}"
            echo -e "  ${GREEN}https://www.docker.com/products/docker-desktop/${NC}"
            echo ""
            echo -e "  Download, run the installer, then ${BOLD}re-run this script${NC}."
            ;;
        Linux)
            echo -e "${YELLOW}${BOLD}→ Install Docker on Linux:${NC}"
            echo ""
            echo -e "  ${BOLD}Ubuntu / Debian:${NC}"
            echo -e "  ${GREEN}curl -fsSL https://get.docker.com | sh && sudo usermod -aG docker \$USER${NC}"
            echo ""
            echo -e "  ${BOLD}Fedora / RHEL:${NC}"
            echo -e "  ${GREEN}sudo dnf install docker-ce docker-ce-cli && sudo systemctl start docker${NC}"
            echo ""
            echo -e "  ${BOLD}Arch Linux:${NC}"
            echo -e "  ${GREEN}sudo pacman -S docker && sudo systemctl start docker${NC}"
            echo ""
            echo -e "  After installing, ${BOLD}log out and back in${NC}, then re-run this script."
            ;;
        *)
            echo -e "${YELLOW}→ Visit https://docs.docker.com/get-docker/ for your platform.${NC}"
            ;;
    esac

    echo ""
    echo -e "${CYAN}══════════════════════════════════════════════════════════════════════${NC}"
    exit 1
fi

DOCKER_VERSION=$(docker --version 2>/dev/null | awk '{print $3}' | tr -d ',')
echo -e "${GREEN}✅ Docker found — version ${DOCKER_VERSION}${NC}"

# ==============================================================================
# STEP 2: Verify Docker daemon is running
# ==============================================================================
echo ""
echo -e "${YELLOW}${BOLD}[2/5] Checking that Docker is running...${NC}"

if ! docker info > /dev/null 2>&1; then
    echo ""
    echo -e "${RED}${BOLD}✗ Docker is installed but not currently running.${NC}"
    echo ""

    OS="$(uname -s)"
    if [[ "$OS" == "Darwin" ]]; then
        echo -e "${YELLOW}→ Please ${BOLD}open Docker Desktop${NC}${YELLOW} from your Applications folder,"
        echo -e "  wait for the whale icon in your menu bar to stop animating, then"
        echo -e "  re-run this script.${NC}"
    else
        echo -e "${YELLOW}→ Start the Docker service and re-run this script:${NC}"
        echo -e "  ${GREEN}sudo systemctl start docker${NC}"
    fi

    echo ""
    echo -e "${CYAN}══════════════════════════════════════════════════════════════════════${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker daemon is running.${NC}"

# ==============================================================================
# STEP 3: Verify Docker Compose is available
# ==============================================================================
COMPOSE_CMD="$(get_compose_cmd)"

if [ -z "$COMPOSE_CMD" ]; then
    echo ""
    echo -e "${RED}${BOLD}✗ Docker Compose was not found.${NC}"
    echo ""
    echo -e "${YELLOW}→ Docker Compose is included in modern Docker Desktop."
    echo -e "  If you are on Linux, install it with:${NC}"
    echo -e "  ${GREEN}sudo apt install docker-compose-plugin${NC}  ${CYAN}(Ubuntu/Debian)${NC}"
    echo -e "  ${GREEN}sudo dnf install docker-compose-plugin${NC}   ${CYAN}(Fedora/RHEL)${NC}"
    echo ""
    echo -e "${CYAN}══════════════════════════════════════════════════════════════════════${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker Compose found — using '${COMPOSE_CMD}'.${NC}"

# ==============================================================================
# STEP 4: Environment Configuration
# ==============================================================================
echo ""
echo -e "${YELLOW}${BOLD}[3/5] Configuring environment...${NC}"

ENV_FILE="$SCRIPT_DIR/.env"
EXAMPLE_FILE="$SCRIPT_DIR/.env.example"

if [ ! -f "$ENV_FILE" ]; then
    if [ ! -f "$EXAMPLE_FILE" ]; then
        echo -e "${RED}[!] Could not find '.env.example' inside: $SCRIPT_DIR${NC}"
        exit 1
    fi

    echo -e "${GREEN}[+] Creating '.env' from template...${NC}"
    cp "$EXAMPLE_FILE" "$ENV_FILE"

    echo -e "${GREEN}[+] Generating cryptographically secure secrets...${NC}"

    generate_secret() {
        if command -v openssl > /dev/null 2>&1; then
            openssl rand -base64 32 | tr -d '\n/+='
        elif [ -e /dev/urandom ]; then
            head -c 32 /dev/urandom | base64 | tr -d '\n/+='
        else
            echo "sec_$(date +%s)_fallback"
        fi
    }

    random_password() {
        local chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        local rand_str=""
        for i in {1..24}; do
            rand_str="${rand_str}${chars:RANDOM%${#chars}:1}"
        done
        echo "$rand_str"
    }

    NEXTAUTH_SECRET=$(generate_secret)
    PG_PASS=$(random_password)
    REDIS_PASS=$(random_password)
    MINIO_PASS=$(random_password)
    ADMIN_PASS=$(random_password)

    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/changeme_some_ultra_secure_long_secret_phrase/$NEXTAUTH_SECRET/g" "$ENV_FILE"
        sed -i '' "s/choose_a_strong_database_password_here/$PG_PASS/g" "$ENV_FILE"
        sed -i '' "s/choose_a_strong_redis_password_here/$REDIS_PASS/g" "$ENV_FILE"
        sed -i '' "s/choose_a_strong_minio_password_here/$MINIO_PASS/g" "$ENV_FILE"
        sed -i '' "s/choose_a_strong_admin_password_here/$ADMIN_PASS/g" "$ENV_FILE"
    else
        sed -i "s/changeme_some_ultra_secure_long_secret_phrase/$NEXTAUTH_SECRET/g" "$ENV_FILE"
        sed -i "s/choose_a_strong_database_password_here/$PG_PASS/g" "$ENV_FILE"
        sed -i "s/choose_a_strong_redis_password_here/$REDIS_PASS/g" "$ENV_FILE"
        sed -i "s/choose_a_strong_minio_password_here/$MINIO_PASS/g" "$ENV_FILE"
        sed -i "s/choose_a_strong_admin_password_here/$ADMIN_PASS/g" "$ENV_FILE"
    fi

    echo -e "${GREEN}✅ .env created with auto-generated secure passwords!${NC}"
else
    echo -e "${GREEN}✅ Existing .env found — skipping generation.${NC}"
fi

# ==============================================================================
# STEP 5: Authenticate with the Private Container Registry (GHCR)
# ==============================================================================
echo ""
echo -e "${YELLOW}${BOLD}[4/5] Authenticating with the Xpectra container registry...${NC}"

# Check if we're already authenticated
if docker pull ghcr.io/xpectraflow/xpectra-web:latest > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Already authenticated with the container registry.${NC}"
else
    echo ""
    echo -e "${CYAN}Xpectra images are hosted in a secure private registry."
    echo -e "Please enter your premium Xpectra License Code to authenticate.${NC}"
    echo ""

    read -rsp "$(echo -e "${YELLOW}  Enter your Xpectra License Code (hidden): ${NC}")" LICENSE_CODE
    echo ""

    if echo "$LICENSE_CODE" | docker login ghcr.io -u xpectraflow-licensing --password-stdin > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Successfully authenticated with the container registry!${NC}"
    else
        echo ""
        echo -e "${RED}${BOLD}✗ Authentication failed.${NC}"
        echo -e "${YELLOW}  Please double-check your License Code and try again.${NC}"
        echo ""
        echo -e "${CYAN}══════════════════════════════════════════════════════════════════════${NC}"
        exit 1
    fi
fi

# ==============================================================================
# STEP 6: Boot the Stack
# ==============================================================================
echo ""
echo -e "${YELLOW}${BOLD}[5/5] Pulling images and booting Xpectra...${NC}"
echo -e "${CYAN}(This may take a few minutes on first run while images download)${NC}"
echo ""

cd "$SCRIPT_DIR"
$COMPOSE_CMD pull
$COMPOSE_CMD up -d

echo ""
echo -e "${CYAN}══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}🎉 Xpectra is live!${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BOLD}Dashboard URL :${NC}  ${GREEN}${DASHBOARD_URL}${NC}"
echo -e "  ${BOLD}Login email   :${NC}  Check ${GREEN}XPECTRA_INIT_USER_EMAIL${NC} in your .env"
echo -e "  ${BOLD}Login password:${NC}  Check ${GREEN}XPECTRA_INIT_USER_PASSWORD${NC} in your .env"
echo ""
echo -e "  ${CYAN}Tip: Run '${COMPOSE_CMD} logs -f xpectra-web' to watch startup logs.${NC}"
echo ""

# Auto-open dashboard in the default browser
echo -e "${YELLOW}Opening the dashboard in your browser...${NC}"
open_browser "$DASHBOARD_URL"

echo ""
echo -e "${CYAN}══════════════════════════════════════════════════════════════════════${NC}"
