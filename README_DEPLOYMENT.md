# Deployment Guide

## GitHub Actions - Automatic Image Build

When you push to `main`, `dev`, or `staging` branches, GitHub Actions automatically builds a Docker image and pushes it to GitHub Container Registry (GHCR).

### Setup Required GitHub Secrets

Go to **Repository Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `PROD_BACKEND_URL` | Production API URL (for main branch) | `https://api.paysphere.com/v1` |
| `STAGING_BACKEND_URL` | Staging API URL (for staging branch) | `https://api-staging.paysphere.com/v1` |
| `DEV_BACKEND_URL` | Development API URL (for dev branch) | `https://api-dev.paysphere.com/v1` |

### How It Works

1. You push code to `main`, `dev`, or `staging` branch
2. GitHub Actions builds Docker image with the correct backend URL
3. Image is pushed to `ghcr.io/YOUR_ORG/paysphere-app:TAG`
   - `main` branch → `latest` tag
   - `staging` branch → `staging` tag
   - `dev` branch → `dev` tag

---

## Manual Deployment on EC2

### 1. Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `Docker Pull Token`
4. Select scope: ✅ `read:packages`
5. Click **"Generate token"**
6. Copy the token (starts with `ghp_`)

### 2. Login to GHCR on Your Server

SSH into your EC2 instance and run:

```bash
# Replace with your GitHub username and token
export GITHUB_USERNAME="your-username"
export GITHUB_TOKEN="ghp_your_token_here"

# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin
```

### 3. Pull and Run the Image

```bash
# Pull the image (replace YOUR_ORG/paysphere-app with your repo)
docker pull ghcr.io/YOUR_ORG/paysphere-app:latest

# Stop old container (if exists)
docker stop paysphere-frontend 2>/dev/null || true
docker rm paysphere-frontend 2>/dev/null || true

# Run new container
docker run -d \
  --name paysphere-frontend \
  --restart unless-stopped \
  -p 80:80 \
  ghcr.io/YOUR_ORG/paysphere-app:latest

# Check it's running
docker ps
docker logs paysphere-frontend
```

### 4. Access Your App

Open browser: `http://YOUR_EC2_IP`

---

## Using Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    image: ghcr.io/YOUR_ORG/paysphere-app:latest
    container_name: paysphere-frontend
    restart: unless-stopped
    ports:
      - "80:80"
```

Then run:

```bash
# First login to GHCR (see step 2 above)
# Then:
docker compose pull
docker compose up -d
```

---

## Update Your App

```bash
# Pull latest image
docker pull ghcr.io/YOUR_ORG/paysphere-app:latest

# Restart
docker compose restart

# Or manually:
docker stop paysphere-frontend
docker rm paysphere-frontend
docker run -d --name paysphere-frontend --restart unless-stopped -p 80:80 ghcr.io/YOUR_ORG/paysphere-app:latest
```

---

## Common Commands

```bash
# View logs
docker logs -f paysphere-frontend

# Restart
docker restart paysphere-frontend

# Stop
docker stop paysphere-frontend

# Check status
docker ps
```

That's it! Simple and manual. 🎉
