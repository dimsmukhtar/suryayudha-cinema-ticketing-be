FROM node:20-slim AS base
ENV NODE_ENV=production

RUN corepack enable
WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    libc6 \
    libgcc-s1 \
    libstdc++6 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma:generate:prod
RUN pnpm build

RUN useradd -m appuser \
    && mkdir -p /app/logs \
    && chown -R appuser:appuser /app/logs \
    && chown -R appuser:appuser /app/node_modules

USER appuser

EXPOSE 3000

CMD ["node", "build/server/index.js"]
