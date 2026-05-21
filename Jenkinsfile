pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "buspass"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                echo '==> Checking out source code...'
                checkout scm
            }
        }

        stage('Prepare Environment') {
            steps {
                echo '==> Setting up production environment file...'
                // Copy the .env.production from the server into the workspace
                sh 'cp /home/prajwal/bus-pass-management-system/backend/.env.production backend/.env.production'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '==> Building Docker images...'
                sh 'docker compose build --no-cache'
            }
        }

        stage('Stop Old Containers') {
            steps {
                echo '==> Stopping running containers...'
                sh '''
                    docker compose down --remove-orphans || true
                    docker stop buspass-mongo buspass-backend buspass-frontend 2>/dev/null || true
                    docker rm buspass-mongo buspass-backend buspass-frontend 2>/dev/null || true
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '==> Starting all services...'
                sh 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                echo '==> Waiting for services to become healthy...'
                sh '''
                    sleep 20
                    docker compose ps
                    curl --fail --silent --max-time 10 http://localhost:5000/ || \
                        (echo "Backend health check failed" && docker compose logs backend && exit 1)
                    curl --fail --silent --max-time 10 http://localhost:3000/ || \
                        (echo "Frontend health check failed" && docker compose logs frontend && exit 1)
                    echo "All services healthy!"
                '''
            }
        }
    }

    post {
        success {
            echo '''
            ============================================
             Deployment Successful!
             Frontend : http://172.27.171.145:3000
             Backend  : http://172.27.171.145:5000
            ============================================
            '''
        }
        failure {
            echo '==> Build failed. Printing logs...'
            sh 'docker compose logs --tail=50 || true'
        }
        always {
            echo '==> Cleaning up dangling Docker images...'
            sh 'docker image prune -f || true'
        }
    }
}
