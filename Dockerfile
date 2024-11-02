FROM node:23-bookworm AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
COPY patches/ patches/

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS dev-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=dev-deps /app/node_modules/ node_modules/
COPY package.json vite.config.ts svelte.config.js tsconfig.json drizzle.config.ts postcss.config.js tailwind.config.ts ./
COPY src/ src/
COPY static/ static/
RUN DATABASE_URL=local.db pnpm build

FROM node:23-bookworm AS release
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules/ node_modules/
COPY --from=build /app/build/ ./
COPY --from=build /app/local.db ./
COPY src/lib/server/db/schema.ts ./src/lib/server/db/schema.ts
COPY drizzle.config.ts run.sh ./

EXPOSE 3000/tcp
ENTRYPOINT [ "sh", "run.sh" ]