# 🚀 XpectraFlow Self-Hosting Deployments

Welcome to the official self-hosting deployment template for **XpectraFlow** — the ultra-high performance telemetry visualization and ingestion pipeline.

This repository contains the production `docker-compose.yml` config and environmental templates to spin up your secure, self-hosted console and ingestion engine inside a multi-container stack.

---

## 🏗️ Architecture Stack Overview

When you boot XpectraFlow, Docker automatically orchestrates the following isolated service layers:

- **Next.js Console (`xpectra-web`):** The primary user interface and management dashboard.
- **Go Ingestion Engine (`xpectra-consumer`):** High-speed telemetry parser supporting raw CSV uploads, HTTP stream buffers, and gRPC conduits.
- **TimescaleDB:** Timeseries hypertable-powered database storing telemetry and metadata.
- **Redis:** Enterprise job queues and session-caching layer.
- **MinIO:** S3-compatible local object storage for high-density historical CSV files.

---

## ⚡ Quickstart Deployment Instructions

### Prerequisites
Make sure you have the following installed on your target server:
- **Docker Engine** (v20.10.0 or later)
- **Docker Compose** (v2.0.0 or later)

---

### Step 1: Clone the deployment configuration
Clone this repository directly to your server:
```bash
git clone https://github.com/xpectraflow/xpectra.git
cd xpectra
```

### Step 2: Configure your environment variables
Copy the environment template and edit the credentials:
```bash
cp .env.example .env
nano .env
```
> [!IMPORTANT]
> Change all default passwords (such as `POSTGRES_PASSWORD`, `REDIS_AUTH`, and `MINIO_ROOT_PASSWORD`) and generate a safe 32-character authentication string using:
> `openssl rand -base64 32` for `NEXTAUTH_SECRET`.

---

### Step 3: Authenticate with the Private Container Registry
Because XpectraFlow core images are hosted securely, you must log in to the GitHub Container Registry using your unique access token (password):
```bash
docker login ghcr.io -u YOUR_GITHUB_USERNAME -p YOUR_CLIENT_PULL_TOKEN
```
*Note: Your access token/password is provided by Xpectra upon active purchase or license sign-up.*

---

### Step 4: Boot the application
Spin up the container stack in detached background mode:
```bash
docker compose up -d
```
Docker will pull the secure images from GHCR and load the databases. The bootstrapping logic will auto-initialize your admin account.

---

### Step 5: Access the Dashboard
Open your web browser and navigate to:
```
http://YOUR_SERVER_IP:3000
```
Log in using the default email and password you configured under the `Automatic Root Bootstrapping` section of your `.env` file!

---

## ⚙️ Maintenance & Operations

### Stop the service stack
To safely spin down the containers without deleting stored database volumes, run:
```bash
docker compose down
```

### Pull and apply updates
To pull the latest private version updates and reload your containers safely:
```bash
docker compose pull
```
*Note: Make sure you are authenticated with `docker login ghcr.io` first.*
```bash
docker compose up -d
```

### Read service logs
To inspect container startup steps or debugging events:
```bash
docker compose logs -f xpectra-web
docker compose logs -f xpectra-consumer
```

---

## 🛠️ Troubleshooting

### 1. Database Connection and Migration Retries
During the very first startup, **TimescaleDB** requires a few seconds to run its initial database creation scripts. 
* **Self-Healing:** The Next.js console (`xpectra-web`) is equipped with a self-healing retry loop. If it encounters a connection error (like `ECONNREFUSED`) while TimescaleDB is booting, it will log a warning and automatically retry the connection every 2 seconds for up to 30 seconds until the database is fully up and ready.
* **Go Consumer:** Similarly, `xpectra-consumer` will automatically attempt to reconnect to the database until successful.

### 2. Changing Database Credentials in `.env` Later
PostgreSQL only runs its initial user and password setup **on the very first boot when the database data directory is completely empty**. 
If you edit `POSTGRES_USER` or `POSTGRES_PASSWORD` in your `.env` file *after* running the containers for the first time, PostgreSQL will ignore the new credentials because the database volume is already initialized.

To successfully apply new credentials, you must do one of the following:

#### A. Clean Reset (Recommended for brand new setups — Destroys existing data)
Stop the stack and completely delete the initialized Docker volumes:
```bash
docker compose down -v
docker compose up -d
```
*(This destroys the old database volume and forces PostgreSQL to perform a clean initialization with your new `.env` settings).*

#### B. Manual Password Update (For production systems — Retains existing data)
If you already have active data and want to update the password without data loss:
1. Access the running TimescaleDB container CLI:
   ```bash
   docker exec -it timescaledb psql -U OLD_USERNAME -d postgres
   ```
2. Update the password manually:
   ```sql
   ALTER USER old_username WITH PASSWORD 'new_secure_password';
   ```

---

## 🔒 Security Best Practices
1. **SSL Termination:** Always route external traffic through a secure reverse proxy (like **Nginx**, **Traefik**, or **Caddy**) with active SSL certificates for `HTTPS` and `WSS`.
2. **Private Port Scoping:** Keep internal database ports (`5432`, `6379`, `9000`) private. They are bound within the internal Docker network and not exposed to the public internet by default.
