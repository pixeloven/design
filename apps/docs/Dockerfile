# The docs site, as a container.
#
# WHY AN IMAGE AND NOT A CONFIGMAP. Harmony serves its other static site
# (harmony-docs) from a hash-suffixed ConfigMap holding a single 28 KB
# index.html. Storybook's output is ~8.4 MB across hundreds of files, well past
# the 1 MiB ConfigMap ceiling, so that pattern was never available here.
#
# Two stages: the build needs the whole pnpm workspace (the docs read
# packages/tokens and packages/brand at build time, which is what stops the
# documentation drifting from what ships), while the runtime needs nothing but
# the static output and a web server.

# --- build -------------------------------------------------------------------
FROM node:22-alpine AS build

# corepack ships with node and honours the root package.json's packageManager
# field, so the pnpm version is declared in exactly one place.
RUN corepack enable

WORKDIR /src

# Copy manifests first so a dependency install is cached independently of a
# content edit — the common case here is editing an MDX page.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/tokens/package.json ./packages/tokens/
COPY packages/brand/package.json ./packages/brand/
COPY apps/docs/package.json ./apps/docs/

# --ignore-scripts because tokens' `prepare` script builds dist/ and its source
# is not copied yet. The build below runs it explicitly.
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY packages ./packages
COPY apps/docs ./apps/docs

# Tokens must be built before the docs import them; dist/ is generated and not
# in the repo.
RUN node packages/tokens/src/build.mjs \
 && pnpm --filter @pixeloven/docs build

# --- runtime -----------------------------------------------------------------
# Unprivileged nginx: runs as uid 101, binds 8080, and needs no root. Same image
# harmony-docs uses, so the deployment shape is already proven in this cluster.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY --from=build /src/apps/docs/storybook-static /usr/share/nginx/html

# Storybook is a static SPA-ish bundle: real files for everything, so no
# try_files rewrite is needed. The default nginx config serves it as-is.
EXPOSE 8080
