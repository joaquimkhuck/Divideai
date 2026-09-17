#!/bin/sh
# Cria/atualiza as tabelas e sobe a API (8080) e o Caddy (3000).
set -e
pnpm --filter @workspace/db run push || echo "aviso: drizzle push falhou, seguindo"
PORT=8080 node --enable-source-maps artifacts/api-server/dist/index.mjs &
exec caddy run --config deploy/Caddyfile --adapter caddyfile
