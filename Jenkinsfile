pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '5'))
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    parameters {
        booleanParam(name: 'RUN_TESTS',         defaultValue: true,  description: 'npm test chalayein')
        booleanParam(name: 'DEPLOY',            defaultValue: true,  description: 'Container deploy karein')
        booleanParam(name: 'PUSH_TO_DOCKERHUB', defaultValue: false, description: 'Image Docker Hub par push karein')
    }

    environment {
        IMAGE     = 'harisfarooqi/task-management-api'
        CONTAINER = 'task-api-jenkins'
        HOST_PORT = '4001'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --oneline'
            }
        }

        stage('Install & Test') {
            when { expression { params.RUN_TESTS } }
            steps {
                sh '''
                    docker run --rm \
                      -u $(id -u):$(id -g) \
                      -e HOME=/tmp \
                      -v "$WORKSPACE":/app -w /app \
                      node:20-alpine sh -c "npm ci && npm test"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE:$BUILD_NUMBER -t $IMAGE:latest .'
            }
        }

        stage('Push to Docker Hub') {
            when { expression { params.PUSH_TO_DOCKERHUB } }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub',
                                                  usernameVariable: 'DH_USER',
                                                  passwordVariable: 'DH_TOKEN')]) {
                    sh '''
                        echo "$DH_TOKEN" | docker login -u "$DH_USER" --password-stdin
                        docker push $IMAGE:$BUILD_NUMBER
                        docker push $IMAGE:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy') {
            when { expression { params.DEPLOY } }
            steps {
                sh '''
                    docker rm -f $CONTAINER || true
                    docker run -d \
                      --name $CONTAINER \
                      --restart unless-stopped \
                      -p $HOST_PORT:4000 \
                      $IMAGE:latest
                '''
            }
        }

        stage('Verify API') {
            when { expression { params.DEPLOY } }
            steps {
                sh '''
                    sleep 5
                    curl --fail http://localhost:$HOST_PORT/health | tee health-response.txt
                '''
            }
        }
    }

    post {
        success {
            echo "Deploy successful: http://localhost:${HOST_PORT}/health"
            sh '''
                echo "build=$BUILD_NUMBER image=$IMAGE:$BUILD_NUMBER url=http://localhost:$HOST_PORT/health" > build-info.txt
            '''
            archiveArtifacts artifacts: 'build-info.txt, health-response.txt',
                             allowEmptyArchive: true, fingerprint: true
        }
        failure {
            echo 'Pipeline failed, upar Console Output dekhein.'
            sh 'docker logs $CONTAINER || true'
        }
        cleanup {
            deleteDir()
        }
    }
}
