#!/usr/bin/env bash
# ==============================================================================
# XpectraFlow Premium Local Stack & SDK Installer (Bash)
# ==============================================================================
set -e

# Term Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear
clear

# Color codes
CYAN=$(tput setaf 6)
GREEN=$(tput setaf 2)
NC=$(tput sgr0)

echo -e "${CYAN}======================================================================${NC}"
cat << 'EOF'
 __   __               _                 ______ _                     
 \ \ / /              | |               |  ____| |                    
  \ V /_ __   ___  ___| |_ _ __ __ _    | |__  | | _____      __      
   > <| '_ \ / _ \/ __| __| '__/ _` |   |  __| | |/ _ \ \ /\ / /      
  / . \ |_) |  __/ (__| |_| | | (_| |   | |    | | (_) \ V  V /       
 /_/ \_\ .__/ \___|\__|\__|_|  \__,_|   |_|    |_|\___/ \_/\_/        
       | |                                                            
       |_|                                                            
EOF
echo -e "${CYAN}======================================================================${NC}"
echo -e "${GREEN}               XpectraFlow Premium Self-Hosting Suite Setup            ${NC}"
echo -e "${CYAN}======================================================================${NC}"
echo ""

# ------------------------------------------------------------------------------
# 1. Environment Config Setup (.env)
# ------------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
EXAMPLE_FILE="$SCRIPT_DIR/.env.example"

echo -e "${YELLOW}[*] Checking Environment Configuration...${NC}"

if [ ! -f "$ENV_FILE" ]; then
    if [ -f "$EXAMPLE_FILE" ]; then
        echo -e "${GREEN}[+] Creating '.env' from '.env.example'...${NC}"
        cp "$EXAMPLE_FILE" "$ENV_FILE"
        
        echo -e "${GREEN}[+] Generating cryptographically secure production keys...${NC}"
        
        # Cross-platform secure random generator helper
        generate_secret() {
            if command -v openssl >/dev/null 2>&1; then
                openssl rand -base64 32 | tr -d '\n'
            elif [ -e /dev/urandom ]; then
                head -c 32 /dev/urandom | base64 | tr -d '\n'
            else
                # Fallback simple random string if no openssl/urandom is present
                echo "sec_$(date +%s)_$(random_string)"
            fi
        }
        
        random_string() {
            local chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            local rand_str=""
            for i in {1..20}; do
                rand_str="${rand_str}${chars:RANDOM%${#chars}:1}"
            done
            echo "$rand_str"
        }
        
        NEXTAUTH_SECRET=$(generate_secret)
        PG_PASS=$(random_string)
        REDIS_PASS=$(random_string)
        MINIO_PASS=$(random_string)
        ADMIN_PASS=$(random_string)
        
        # Update values in-place safely on both macOS (BSD sed) and Linux (GNU sed)
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
        
        echo -e "${GREEN}✅ Created .env with pre-seeded, randomly generated secure passwords!${NC}"
    else
        echo -e "${RED}[!] Could not find '.env.example' template inside: $SCRIPT_DIR${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Existing '.env' configuration found. Skipping setup.${NC}"
fi

echo ""

# ------------------------------------------------------------------------------
# 2. Client SDK Installation (xpectra-client)
# ------------------------------------------------------------------------------
echo -e "${YELLOW}[*] Checking for local Python and Pip setup...${NC}"

PYTHON_CMD=""
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
fi

if [ -z "$PYTHON_CMD" ]; then
    echo -e "${RED}[!] Python was not detected in your system PATH.${NC}"
    echo -e "${YELLOW}[!] Skipping automatic SDK package installation.${NC}"
    echo -e "${CYAN}[!] To install the SDK manually from GitHub, run:${NC}"
    echo -e "    pip install git+https://github.com/xpectraflow/xpectra-client.git#subdirectory=python"
else
    VERSION=$($PYTHON_CMD --version)
    echo -e "${GREEN}✅ Detected Python: $VERSION${NC}"
    echo -e "${YELLOW}[*] Installing official xpectra-client SDK directly from GitHub...${NC}"
    
    if $PYTHON_CMD -m pip install "git+https://github.com/xpectraflow/xpectra-client.git#subdirectory=python" 2>&1; then
        echo -e "${GREEN}✅ Client SDK (xpectra-client) successfully installed on your Python runtime!${NC}"
    else
        echo -e "${RED}[!] Direct pip installation from GitHub failed.${NC}"
        echo -e "${CYAN}[!] To try installing the SDK manually, run:${NC}"
        echo -e "    pip install git+https://github.com/xpectraflow/xpectra-client.git#subdirectory=python"
    fi
fi

echo ""
echo -e "${CYAN}======================================================================${NC}"
echo -e "${GREEN}🎉 XpectraFlow Self-Hosting Suite is Ready to Boot!${NC}"
echo -e "${CYAN}======================================================================${NC}"
echo -e "   To start the entire containerized telemetry platform, simply run:"
echo -e "   ${GREEN}docker compose up -d${NC}"
echo -e "${CYAN}======================================================================${NC}"
