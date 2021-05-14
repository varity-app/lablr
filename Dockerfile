# Build the frontend application
FROM node:14 as frontend-builder
COPY frontend /opt/frontend
WORKDIR /opt/frontend

RUN npm install
RUN npm run build

RUN cp -r build /static

# Run application
FROM ubuntu:18.04

RUN apt update -y
RUN apt install -y software-properties-common

RUN : \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        software-properties-common \
    && add-apt-repository -y ppa:deadsnakes \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        python3.8-venv nginx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && :

RUN python3.8 -m venv /venv
ENV PATH=/venv/bin:$PATH

ADD backend/requirements.txt /tmp/requirements.txt
RUN python -m pip install -r /tmp/requirements.txt

COPY backend/src /app
COPY --from=frontend-builder /static /static
COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

ENTRYPOINT nginx && uvicorn main:app


