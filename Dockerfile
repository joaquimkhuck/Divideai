# Deploy fora do Replit (Coolify): um container com o front estatico (Caddy)
# e a API Express, na mesma origem. /api vai para a API, o resto e o app.
FROM node:24-slim
RUN corepack enable && corepack prepare pnpm@10 --activate
COPY --from=caddy:2 /usr/bin/caddy /usr/bin/caddy
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
RUN NODE_ENV=production PORT=3000 BASE_PATH=/ pnpm --filter @workspace/divide-ai run build \
 && NODE_ENV=production pnpm --filter @workspace/api-server run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "deploy/start.sh"]
