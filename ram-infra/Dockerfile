####################################################################################
FROM ubuntu AS base

ENV TZ=America/Mexico_City
ENV LANG=en_US.UTF-8
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
        --no-install-recommends \
        curl \
        wget \
        supervisor \
        locales \
        tzdata \
    && locale-gen en_US.UTF-8 \
    && update-locale LANG=en_US.UTF-8 \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata \
    && mkdir /checks \
    && mkdir /scripts \
    && mkdir /conf \
    && mkdir /app \
    && chmod 777 /checks

# node setup
RUN curl -fsSL https://deb.nodesource.com/setup_18.x  \
    | bash - \
    && apt-get install -y \
        --no-install-recommends \
        nodejs \
    && npm install -g \
        yarn \
        serve

# postgres setup
RUN apt-get install -y \
    --no-install-recommends \
    postgresql \
    postgresql-contrib

# minio setup
RUN cd /tmp && \
    wget https://dl.min.io/server/minio/release/linux-amd64/minio && \
    chmod +x minio && \
    mv minio /usr/local/bin/minio && \
    groupadd -r minio && \
    useradd -M -r -g minio minio && \
    mkdir -p /data/minio && \
    chown -R minio:minio /data/minio

# configuration files
WORKDIR /infra
COPY ram-infra .
RUN cp pg_hba.conf /etc/postgresql/14/main/pg_hba.conf \
    && cp postgresql.conf /var/lib/postgresql/14/main/postgresql.conf \
    && mkdir -p /var/lib/postgresql/14/main/conf.d \
    && cp db-setup.sh /scripts/db-setup.sh

CMD ["supervisord", "-c", "/conf/supervisord.conf"]

####################################################################################
FROM base as frontend

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app/frontend
COPY ram-front .
RUN yarn \
    && yarn build

####################################################################################
FROM base as backend

WORKDIR /app/backend
COPY ram-back .
RUN yarn \
    && yarn build

####################################################################################
FROM base as remote

COPY --from=frontend /app/frontend/dist /app/frontend/dist
COPY --from=backend /app/backend/dist /app/backend/dist
COPY --from=backend /app/backend/node_modules /app/backend/node_modules

RUN cp /infra/supervisord.remote.conf /conf/supervisord.conf \
    && chmod +x /scripts/*.sh

####################################################################################
FROM base as local

ENV MINIO_ROOT_USER=root
ENV MINIO_ROOT_PASSWORD=rootroot
RUN cp /infra/supervisord.local.conf /conf/supervisord.conf \
    && chmod +x /scripts/*.sh
