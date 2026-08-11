pipeline {
    agent any

    environment {
        IMAGE_NAME = '2248-game'
        CONTAINER_NAME = 'game-2248'
        PORT_MAPPING = '3010:80'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image for 2248 Game...'
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
                sh "docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Deploying 2248 Game container...'
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
                sh "docker run -d --name ${CONTAINER_NAME} -p ${PORT_MAPPING} ${IMAGE_NAME}:latest"
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! Game is live at http://localhost:3010'
        }
        failure {
            echo 'Pipeline failed. Check build logs.'
        }
    }
}
