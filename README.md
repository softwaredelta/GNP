# Delta Software | GNP (RAM)

Make sure you have `yarn` and `docker` installed.

1. https://www.docker.com/products/docker-desktop/
2. https://nodejs.org/en/download
3. `npm i -g yarn`

Simply run `dev.ps1`

```sh
$ .\dev
```

This script will build the local development image, install
project dependencies, and run the frontend and backend in
watch mode, so you can work with hot reload.

Try opening http://localhost:3000 to see the website. This
website connects to the backend at http://localhost:8080.
This backend in turn connects to the database at port 5432
and the S3 storage at port 9000. You can check the S3
console at http://localhost:9001 with credentials `user = root`
and `password = rootroot`.

_All of this is provisioned entirely locally and self
contained_.

---

If you change configuration or dependencies, make sure to stop
and re-run the script.

## Infra

We have three usable architectures.

1. Local
2. Remote
3. Production - AWS

Local is what we use when we are developing in our machine. Local
provides a database and other services directly from the host
machine.

Remote is a way of deploying the system to a provider such as Fly.IO,
so we can make tests in an architecture that simulates that of
production, but without having to provision the real thing.

Production is the actual AWS deployment, with a real RDB, EB app, CDN,
etc.

---

### Components

- [x] Postgres connection
- [x] S3 connection
- [ ] Test framework
- [ ] TypeORM migrations
- [ ] Logging / Error reporting

### Configuration

Configuration is hard. We have to consider the configuration for
frontend and backend, and for the local, remote, and AWS deployments.

Frontend: The frontend is configured at build time. Locally, we
provide configuration via a env file. For remote, we provide
configuration as env variables given to the docker image at build
tiem. For AWS, we provide them via the build project.

Backend: The backend is configured at runtime. Locally, we provide
configuration via an env file. For remote, we use whichever secrets
provider the platform gives us, such as Fly.IO seecrets. For AWS,
we use Elastic Beanstalk secrets.

**Notes:**

1. In AWS, we prefix the static site with "/site" and the backend with
   "/api" so we can serve both of them from the same EB environment.
   In local or other deployments we don't prefix any of them.

### Variables

```
CONFIG              DESCRIPTION                             TARGET     LOCAL              Fly.IO                                   AWS
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
VITE_API_URL        where the app connects to the backend   frontend   .env.development   fly.toml build args                      cfn, build action
APP_PORT            where the app should listen             frontend   vite config file   fly.toml                                 -----
API_PORT            where the api should listen             backend    .env.development   fly.toml                                 cfn, eb env
PGHOST              postgres connection info                backend    .env.development   fly secrets
PGPORT              postgres connection info                backend    .env.development   fly secrets
PGUSER              postgres connection info                backend    .env.development   fly secrets
PGDATABASE          postgres connection info                backend    .env.development   fly secrets
PGPASSWORD          postgres connection info                backend    .env.development   fly secrets
PGPASSWORD          postgres setup                          postgres   docker run         fly secrets
NODE_ENV            backend node mode                       backend    -----              fly.toml (should be set to "remote")     cfn, eb env (should be set to "aws")
### DOCKER SPECIFIC CONFIG (for local or remote)
MINIO_ROOT_USER     minio root username                     minio      dockerfile         fly secrets                              ----- (we connect to aws s3 instead)
MINIO_ROOT_PASSWORD minio root password                     minio      dockerfile         fly secrets                              ----- (we connect to aws s3 instead)
MINIO_ROOT_USER     minio access key                        backend    in-code            fly secrets                              ----- (we connect to aws s3 instead)
MINIO_ROOT_PASSWORD minio secret key                        backend    in-code            fly secrets                              ----- (we connect to aws s3 instead)
### AWS SPECIFIC CONFIG
API_PREFIX          where the api gets mounted on ("/api")  backend    -----              -----                                    cfn, eb env
PORT                where elastic beanstalk connects to     eb         -----              -----                                    cfn, eb env
BASE_URL            prefix for the site ("/")               frontend   -----              -----                                    cfn, build action
APP_URL             app url to redirect to                  backend    -----              -----                                    cfn, eb env
S3_BUCKET_NAME      bucket for app data storage             backend    -----              -----                                    cfn, eb env
```

### Services

For S3 file storage, we use [Minio](https://min.io/docs/minio/kubernetes/upstream/)
in the local and remote architecture. For production, we will use AWS S3.

### Deployment Guides

**AWS**:

Requirements:

1. [Setup the aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
2. [Create a github connection](https://us-east-1.console.aws.amazon.com/codesuite/settings/connections) - you will need to save the associated ARN, make sure the connection has access to the repository
3. A registered domain - preferably in [Route 53](https://us-east-1.console.aws.amazon.com/route53/home) - you will need access
   to edit the DSN records.

Procedure:

In the following command, you begin the deployment in aws of the cloudformation app.
Cloudformation will setup 99% of everything for us, there is just
a couple of things to consider:

1. If the hosted zone is not in Route 53, don't include the parameter.
   1. When using Route 53, the creation of the TLS certificate should be
   100% automatic. If that's not the case (you should wait a couple of 
   minutes), visit the [AWS Certificate Manager](https://us-east-1.console.aws.amazon.com/acm/home?region=us-east-1#/certificates/list)
   and in the certificate creation in progress, hit the "Create Route 53
   records" manually. That should allow the process to continue.
   2. If not using Route 53. You will have to visit the [AWS Certificate Manager](https://us-east-1.console.aws.amazon.com/acm/home?region=us-east-1#/certificates/list)
   create the CNAME record manually with the domain registrar. Make sure
   to copy the name and value correctly. How to do so will depend on the
   registrar itself.
2. The aws deployment will automatically detect changes to the given branch
   and deploy them directly. Make sure you select the correct branch.
   Force pushes to the repository might break this change detection
   functionality.
3. Hosted zone should be something like `example.com` while domain name
   should be something like `app.ram.example.com`.
4. If anything goes wrong, you should visit [AWS Cloudformation Console](https://us-east-1.console.aws.amazon.com/cloudformation/home)
   and check the stack events and messages. To fix anything, you will have to delete the stack and start over.
5. The process might take a while. We need to wait for AWS to setup the
   ACM certificate, the application environment, the pipeline, the
   load balancer setup, etc. (expect ~15 minutes or so).
6. The AWS architecture only supports a TLS enabled site, so you _will_
   need a domain.

```sh
aws cloudformation `
   create-stack `
   --stack-name $STACK_NAME `
   --template-body "file://ram-infra/aws.yml" `
   --capabilities CAPABILITY_NAMED_IAM `
   --parameters `
      "ParameterKey=ConnectionArn,ParameterValue=$CONNECTION_ARN" `
      "ParameterKey=BranchName,ParameterValue=$BRANCH_NAME" `
      "ParameterKey=DBPassword,ParameterValue=$A_SAFE_DB_PASSWORD" `
      "ParameterKey=HostedZone,ParameterValue=$HOSTED_ZONE" `
      "ParameterKey=FullDomain,ParameterValue=$DOMAIN_NAME" `
      "ParameterKey=MinInstances,ParameterValue=$MIN_INSTANCES" `
      "ParameterKey=MaxInstances,ParameterValue=$MAX_INSTANCES"
```

Troubleshooting:

_TODO_

# Pruebas de Arquitectura

Las pruebas de arquitectura a continuación se realizaron para confirmar una
infraestructura funcional, con conexión adecuada entre los distintos
componentes.

El proceso es el siguiente, para cada configuración, se despliega el
ambiente. Se confirma que el sitio sea accesible, y que por medio de la
funcionalidad mínima implementada, éste pueda conectarse al backend.
Por medio del backend, se confirma la función de la base de datos y
de S3 por medio de endpoints de prueba.

Para el ambiente de producción en AWS, también se prueba la carga que
el sistema soporta. Por medio de [Locust.IO](https://locust.io/),
se prueba la cantidad de usuarios y requests que soporta el sistema,
realizando una variedad de requests al frontend, backend, base de datos
y S3.

## Ambiente Local

Se ejecutó un ambiente local por medio del script `.\dev`. Se confirmó
que todas las conexiones son válidas y funcionales.

## Ambiente remoto

Se desplegó un ambiente remoto por medio de fly.io utilizando la plantilla.
Se confirmó que todas las conexiones son válidas y funcionales.

## AWS / Producción

Se desplegó un ambiente AWS por medio de la plantilla de CloudFormation.
El stack desplegado utilizó el mismo repositorio sin ajustes manuales.
Se confirmó que todos los componentes se conectan correctamente.

**Pruebas de carga:**

Se utilizo locust para simular una carga de usuarios generando diversas
requests a la aplicación. La especificación de las pruebas está en el
archivo `./ram-infra/locustfile.py`.

Cada usuario simula una request del indice del sitio, una request
sencilla a la API, así como requets a la API que a su vez se comunican
con la base de datos y S3.

Primero corremos `locust`
```sh
> cd ram-infra
> locust
```
y accedemos a la [interfaz](http://localhost:8089). Utilizaremos un máximo de
300 usuarios, con un spawn rate de 4 usuarios por segundo.

La prueba se realizó con un despliegue con la siguiente configuración:
```
EC2 instances: t3.micro
Instances: 1-2
Auto-Scaling: default
DB EC2 instance: db.t3.micro
```

El reporte de la prueba está [aquí](./ram-infra/locust_report.html):
```
Max RPS: ~250
Sub-second response time (95th percentil): ~160 users
```
