# Jenkinsfile
Pipleline
```
pipeline {
    agent any
    tools {nodejs "node"}
    parameters {
        //Git Repository url
        string(name:'repoUrl', defaultValue: 'http://code/web.git', description: 'git仓库地址')
        //git branch
        string(name:'repoBranch', defaultValue: 'master', description: 'git Branch')
         //environment
        choice(name: 'ENVIRONMENT',choices:['develop','production'], description: '打包到哪个环境')
        //pom path
        //string(name: 'pomPath', defaultValue: 'pom.xml', description: 'pom.xml的相对路径')
        //服务器参数采用了组合方式，避免多次选择，使用docker为更佳实践【参数值对外隐藏】
        //choice(name: 'server',choices:'192.168.0.115,8090,*****,*****', description: '测试服务器列表选择(IP,Port,Name,Passwd)')
        //测试服务器的dubbo服务端口
        //string(name:'dubboPort', defaultValue: '31100', description: '测试服务器的dubbo服务端口')
        //单元测试代码覆盖率要求，各项目视要求调整参数
        //string(name:'lineCoverage', defaultValue: '20', description: '单元测试代码覆盖率要求(%)，小于此值pipeline将会失败！')
        //若勾选在pipelie完成后会邮件通知测试人员进行验收
        //booleanParam(name: 'isCommitQA',description: '是否邮件通知测试人员进行人工验收',defaultValue: false )
    }
    //Config Environment
    environment {
        GIT_CRED_ID = 'gitlab'
        DOCKER_IMAGE = "XXXX"
         DEPLOYMENT_NAME = 'management'
         NAME_SPACE ='DEV'
         CONTAINER_NAME = 'management'
    }
    options {
        //max keep number
        buildDiscarder(logRotator(numToKeepStr: '2'))
    }
    //Trigger
    triggers {
        pollSCM('H 9 * * 1-5')
    }
    stages {
        stage("Code checkout from Gitlab") {
            steps {
                git branch: params.repoBranch, credentialsId: GIT_CRED_ID, url: params.repoUrl
            }
        }
        // stage("Code Quality Check vis SonarQube") {
        //     steps {
        //         script {
        //             def scannerHome = tool 'sonarqube';
        //             withSonarQubeEnv("sonarqube") {
        //               // sh "${tool('sonarqube')}/bin/sonar-scanner \
        //               // -Dsonar.projectKey=afd-web \
        //             //    -Dsonar.sources=. \
        //              //   -Dsonar.css.node= \
        //              //   -Dsonar.host.url=http://sonar.XXX.com:9000 \
        //              //   -Dsonar.login=33cda8cf91"
        //             }
        //         }
        //     }
        // }
        stage("build") {
            steps {
                script {
                        nodejs(nodeJSInstallationName: 'node') {

                        }
                    }
            }
        }
        stage("docker build && run") {
            steps {
                script {
                    def gitVersion
                    if( params.ENVIRONMENT == "develop" ){
                      //gitVersion = getGitShortCommit()
                       gitVersion = "1.0.0"
                    }else if(params.ENVIRONMENT == "production"){
                       gitVersion = "1.0.0"
                    }
                    //线上
                    //  gitVersion = '1.0.0'
                    echo "构建镜像"
                    sh "docker build  --build-arg ENVIRONMENT=${params.ENVIRONMENT} -t ${DOCKER_IMAGE}:${gitVersion} ."
                    echo "推送仓库"
                    sh "docker push ${DOCKER_IMAGE}:${gitVersion}"
                    echo "k8s执行更新操作"
                    sh "kubectl set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=${DOCKER_IMAGE}:${gitVersion} -n ${NAME_SPACE} || true"
                    //清理构建信息
                    echo "清理构建信息"
                    sh "docker rmi -f ${DOCKER_IMAGE}:${gitVersion}"
                }
            }
        }
        //UI Test
        stage("UI Test") {
            steps {
                echo "UI Test"
            }
        }
    }
}

def getGitShortCommit() {
 return sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
}

```
