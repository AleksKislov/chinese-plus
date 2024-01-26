pipeline {
    agent any

    stages {
        stage('testing') {
            steps {
                sh 'echo {VERSION}'
                sh 'docker compose -f docker-compose.prod.yml build chin_plus_fe'
            }
        }
    }
}