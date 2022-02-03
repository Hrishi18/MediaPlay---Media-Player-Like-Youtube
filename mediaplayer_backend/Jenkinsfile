// Pipeline for CI of Backend (ASP.Net Core Web API)
pipeline {
    agent any
    // Getting code from git repo
    stages {
        stage('Pull') {
            steps {
                git 'https://github.com/Hrishi18/MediaPlayerReactJS.git'
            }
        }
        // Build the project
        stage('Build') {
            steps {
                bat 'dotnet build'
            }
        }
        // Test the Nunit test projects
       
    }
}
