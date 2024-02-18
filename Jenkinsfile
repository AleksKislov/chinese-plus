pipeline {
    agent any

    stages {
        stage('build') {
            steps {
                sh 'echo $VERSION'
                sh 'docker compose -f docker-compose.prod.yml build chin_plus_fe'
            }
        }
        stage('start') {
            steps {
                sh 'echo $VERSION'
                sh 'docker compose -f docker-compose.prod.yml up -d chin_plus_fe'
            }
        }
    }
}     