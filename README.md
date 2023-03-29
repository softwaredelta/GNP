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

### Variables

```
CONFIG              DESCRIPTION                             TARGET     LOCAL              Fly.IO
-------------------------------------------------------------------------------------------------
VITE_API_URL        where the app connects to the backend   frontend   .env.development   fly.toml build args
APP_PORT            where the app should listen             frontend   vite config file   fly.toml
API_PORT            where the api should listen             backend    .env.development   fly.toml
PGHOST              postgres connection info                backend    .env.development   fly secrets
PGPORT              postgres connection info                backend    .env.development   fly secrets
PGUSER              postgres connection info                backend    .env.development   fly secrets
PGDATABASE          postgres connection info                backend    .env.development   fly secrets
PGPASSWORD          postgres connection info                backend    .env.development   fly secrets
PGPASSWORD          postgres setup                          postgres   docker run         fly secrets
NODE_ENV            backend node mode                       backend    omitted            fly.toml (should be set to "remote")
MINIO_ROOT_USER     minio root username                     minio      dockerfile         fly secrets
MINIO_ROOT_PASSWORD minio root password                     minio      dockerfile         fly secrets
MINIO_ROOT_USER     minio access key                        backend    in-code            fly secrets
MINIO_ROOT_PASSWORD minio secret key                        backend    in-code            fly secrets
```

### Services

For S3 file storage, we use [Minio](https://min.io/docs/minio/kubernetes/upstream/)
in the local and remote architecture. For production, we will use AWS S3.

### Deployment Guides

_TODO_

# Pruebas de Arquitectura

## Ambiente Local

Ejecuta el script `.\dev.ps1`, el código de la rama `infra` contiene un
mínimo de código para conectar frontend, backend y base de datos.

Presiona los botones para confirmar que hay una conexión con la base
de datos y el backend.
