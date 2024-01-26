pipeline {
    agent any

    stages {
        stage('testing') {
            steps {
                echo 'VERSION=${APP_VERSION}'
                sh 'docker-compose -f docker-compose.prod.yml build chin_plus_fe'
            }
        }
    }
}