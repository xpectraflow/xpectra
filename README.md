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
docker compose up -d
```

### Read service logs
To inspect container startup steps or debugging events:
```bash
docker compose logs -f xpectra-web
docker compose logs -f xpectra-consumer
```

---

## 🔒 Security Best Practices
1. **SSL Termination:** Always route external traffic through a secure reverse proxy (like **Nginx**, **Traefik**, or **Caddy**) with active SSL certificates for `HTTPS` and `WSS`.
2. **Private Port Scoping:** Keep internal database ports (`5432`, `6379`, `9000`) private. They are bound within the internal Docker network and not exposed to the public internet by default.
