# 🚀 Xpectra — Self-Hosting

**Xpectra** is an ultra-high-performance telemetry visualization and ingestion platform. This repo is everything you need to run your own private, production-grade instance in minutes.

---

## ⚡ One-Command Setup

Pick your operating system and paste the corresponding command into your terminal. The setup script handles everything automatically.

> [!NOTE]
> **What does the script do?**
> It checks whether Docker is installed (and guides you if not), generates a secure configuration file with random passwords, authenticates with the private image registry, boots the full Xpectra stack, and opens the dashboard in your browser — all in one go.

---

### 🪟 Windows

Open **PowerShell** (search for it in the Start Menu) and run:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/xpectraflow/xpectra/main/setup.ps1" -OutFile "setup.ps1"; .\setup.ps1
```

> [!TIP]
> If you've already cloned this repository, just run `.\setup.ps1` directly from the folder.

---

### 🍎 macOS

Open **Terminal** (search for it in Spotlight with `⌘ Space`) and run:

```bash
curl -fsSL https://raw.githubusercontent.com/xpectraflow/xpectra/main/setup.sh | bash
```

> [!TIP]
> If you've already cloned this repository, just run `bash setup.sh` directly from the folder.

---

### 🐧 Linux

Open your terminal and run:

```bash
curl -fsSL https://raw.githubusercontent.com/xpectraflow/xpectra/main/setup.sh | bash
```

> [!TIP]
> If you've already cloned this repository, just run `bash setup.sh` directly from the folder.

---

### What is Docker?

> Docker is a free tool that packages applications so they run identically on any computer, regardless of operating system or configuration. Xpectra uses it to run its database, cache, storage, and web services together as a single unit. **You don't need to know how Docker works** — the setup script handles it for you.
>
> If Docker isn't installed, the script will detect this and give you a direct download link for your platform.

---

## 🏗️ What Gets Deployed

When you run the setup, Docker automatically orchestrates the following isolated service layers:

| Service | Role |
|---|---|
| **xpectra-web** | Next.js management dashboard & console |
| **xpectra-consumer** | Go ingestion engine — CSV uploads, HTTP streams, gRPC |
| **TimescaleDB** | Time-series hypertable database for telemetry & metadata |
| **Redis** | Enterprise job queues and session-caching layer |
| **MinIO** | S3-compatible local object storage for historical CSV files |

---

## 🔐 License Authentication

Xpectra's core images are hosted in a secure private container registry. During setup, the script will prompt you for your premium **Xpectra License Code** (provided upon purchase or license sign-up). 

The setup script will automatically handle authentication and configure your container environment.

---

## ⚙️ Maintenance & Operations

### Stop the service stack
```bash
docker compose down
```

### Pull and apply updates
```bash
docker compose pull
docker compose up -d
```
> [!NOTE]
> Make sure you are authenticated (`docker login ghcr.io`) before pulling updates.

### Read service logs
```bash
docker compose logs -f xpectra-web
docker compose logs -f xpectra-consumer
```

---

## 🛠️ Troubleshooting

### Database not ready on first boot

During the very first startup, **TimescaleDB** needs a few seconds to initialize. Both `xpectra-web` and `xpectra-consumer` have built-in retry loops — they will automatically reconnect every 2 seconds for up to 30 seconds. No action needed.

### Changed `.env` credentials after first boot

PostgreSQL only applies `POSTGRES_USER` / `POSTGRES_PASSWORD` on the very first boot when the data volume is empty. Editing these values later has no effect.

**Option A — Clean reset** *(destroys existing data — use for fresh setups)*
```bash
docker compose down -v
docker compose up -d
```

**Option B — Manual update** *(retains existing data — use for production)*
```bash
# 1. Open a shell in the running TimescaleDB container
docker exec -it timescaledb psql -U OLD_USERNAME -d postgres

# 2. Inside the psql prompt:
ALTER USER old_username WITH PASSWORD 'new_secure_password';
```

---

## 🔒 Security Best Practices

1. **SSL Termination:** Always route external traffic through a secure reverse proxy (**Nginx**, **Traefik**, or **Caddy**) with active SSL certificates for `HTTPS` and `WSS`.
2. **Private Port Scoping:** Internal database ports (`5432`, `6379`, `9000`) are bound within the internal Docker network and are not exposed to the public internet by default.
3. **Rotate secrets regularly:** Update `NEXTAUTH_SECRET` and all passwords in your `.env` periodically, especially after team membership changes.
