# Bus Pass Management System

A full-stack web application for managing student bus passes, built with React, Node.js/Express, and MongoDB — fully containerized with Docker and automated via Jenkins CI/CD.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              Ubuntu Server                  │
│                                             │
│  ┌──────────┐    ┌──────────┐    ┌───────┐  │
│  │ Frontend │───▶│ Backend  │───▶│ Mongo │  │
│  │  (Nginx) │    │(Node.js) │    │  DB   │  │
│  │ :3000    │    │  :5000   │    │:27017 │  │
│  └──────────┘    └──────────┘    └───────┘  │
│                                             │
│  Jenkins (port 8080) triggers on git push   │
└─────────────────────────────────────────────┘
```

---

## Prerequisites on Ubuntu Server

### 1. Install Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Allow current user to run docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

### 2. Install Jenkins

```bash
sudo apt install -y fontconfig openjdk-17-jre

sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install -y jenkins

sudo systemctl enable jenkins
sudo systemctl start jenkins

# Get the initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### 3. Allow Jenkins to use Docker

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

---

## Jenkins Setup

1. Open `http://<your-server-ip>:8080` in your browser
2. Enter the initial admin password from the step above
3. Install **suggested plugins**
4. Create your admin user
5. Install additional plugins:
   - Go to **Manage Jenkins → Plugins → Available**
   - Search and install: **Git**, **Pipeline**, **Docker Pipeline**

### Create the Pipeline Job

1. **New Item** → name it `bus-pass-system` → select **Pipeline** → OK
2. Under **Pipeline**:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: your GitHub/GitLab repo URL
   - Branch: `*/main` (or your branch name)
   - Script Path: `Jenkinsfile`
3. Under **Build Triggers**, check **Poll SCM** and set schedule `H/5 * * * *`
   (polls every 5 minutes — or use a webhook for instant triggers)
4. Click **Save**

### Add Environment Secrets (Recommended)

Instead of committing `.env.production`, store secrets in Jenkins:

1. **Manage Jenkins → Credentials → Global → Add Credentials**
2. Kind: **Secret file**
3. Upload your `backend/.env.production` file
4. ID: `buspass-env`
5. In `Jenkinsfile`, uncomment the `withCredentials` block in the **Prepare Environment** stage

---

## Running Manually (without Jenkins)

```bash
# Clone the repo
git clone <your-repo-url>
cd bus-pass-system

# Create the production env file
cp backend/.env.example backend/.env.production
# Edit backend/.env.production and set a strong JWT_SECRET

# Build and start everything
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

App will be available at:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## Useful Commands

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (wipes database)
docker compose down -v

# Rebuild a single service
docker compose build backend
docker compose up -d backend

# View logs for a specific service
docker compose logs -f backend
docker compose logs -f frontend

# Open a shell inside a container
docker exec -it buspass-backend sh
docker exec -it buspass-mongo mongosh
```

---

## Project Structure

```
bus-pass-system/
├── backend/
│   ├── src/
│   │   ├── middleware/     # Auth & upload middleware
│   │   ├── models/         # Mongoose models (User, BusPass)
│   │   ├── routes/         # Express routes
│   │   ├── utils/          # Mailer, AI verifier
│   │   └── server.js
│   ├── .env.example        # Template — copy to .env.production
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.js
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## Ports

| Service  | Host Port | Container Port |
|----------|-----------|----------------|
| Frontend | 3000      | 80 (nginx)     |
| Backend  | 5000      | 5000           |
| MongoDB  | 27017     | 27017          |
| Jenkins  | 8080      | 8080           |
