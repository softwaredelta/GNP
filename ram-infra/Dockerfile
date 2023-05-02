####################################################################################
FROM node:16 AS base
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
        --no-install-recommends \
        wget \
        supervisor \
    && mkdir /app

RUN npm install -g \
        serve

# minio setup
RUN cd /tmp && \
    wget https://dl.min.io/server/minio/release/linux-amd64/minio \
        --no-check-certificate && \
    chmod +x minio && \
    mv minio /usr/local/bin/minio && \
    groupadd -r minio && \
    useradd -M -r -g minio minio && \
    mkdir -p /data/minio && \
    chown -R minio:minio /data/minio

COPY ./ram-front/ /app/frontend/
RUN cd /app/frontend \
    && yarn install \
    && yarn build

COPY ./ram-back/ /app/backend/
RUN cd /app/backend \
    && yarn install \
    && yarn build

COPY ./ram-infra/supervisord.conf /conf/supervisord.conf
RUN chmod +x /conf/supervisord.conf

CMD ["supervisord", "-c", "/conf/supervisord.conf"]
