#!/bin/bash
# Publica la copia de pruebas en https://polmorera.es/test/
# Se construye en este ordenador y solo se sube el resultado (el VPS no compila nada).
# La web real (polmorera.es/) no se toca: el proxy solo manda aquí las rutas /test.
set -e
cd "$(dirname "$0")/.."
VPS=root@87.106.237.44
BASE_PATH=/test/ MSYS_NO_PATHCONV=1 npm run build >/dev/null
tar -czf /tmp/staging-site.tgz -C dist .
scp -q /tmp/staging-site.tgz deploy/Caddyfile.staging $VPS:/tmp/
ssh -o BatchMode=yes $VPS 'set -e
  mkdir -p /data/staging
  rm -rf /data/staging/site.new && mkdir -p /data/staging/site.new
  tar -xzf /tmp/staging-site.tgz -C /data/staging/site.new
  rm -rf /data/staging/site.old; [ -d /data/staging/site ] && mv /data/staging/site /data/staging/site.old
  mv /data/staging/site.new /data/staging/site
  sed "s/\r$//" /tmp/Caddyfile.staging > /data/staging/Caddyfile
  docker rm -f polmorera-staging >/dev/null 2>&1 || true
  docker run -d --name polmorera-staging --restart unless-stopped --network coolify --memory 128m \
    -v /data/staging/site:/srv/test:ro -v /data/staging/Caddyfile:/etc/caddy/Caddyfile:ro \
    --label "traefik.enable=true" \
    --label "traefik.http.routers.pmstaging.rule=(Host(\`polmorera.es\`) || Host(\`www.polmorera.es\`)) && PathPrefix(\`/test\`)" \
    --label "traefik.http.routers.pmstaging.priority=10000" \
    --label "traefik.http.routers.pmstaging.entrypoints=https" \
    --label "traefik.http.routers.pmstaging.tls=true" \
    --label "traefik.http.routers.pmstaging.tls.certresolver=letsencrypt" \
    --label "traefik.http.services.pmstaging.loadbalancer.server.port=80" \
    caddy:2-alpine >/dev/null
  docker ps --filter name=polmorera-staging --format "{{.Names}} {{.Status}}"'
echo "Publicado: https://polmorera.es/test/"
