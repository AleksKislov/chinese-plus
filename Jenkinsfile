pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
                sh 'make VERSION=${APP_VERSION} build-up-back'
            }
        }
    }
}