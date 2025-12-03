# ═══════════════════════════════════════════════════════════════
# DOCKERFILE FRONTEND - Multi-stage Build
# Architecture: Next.js 15 + React 18 + TypeScript + Tailwind
# ═══════════════════════════════════════════════════════════════

# ───────────────────────────────────────────────────────────────
# STAGE 1: Base (commune dev + prod)
# ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS base

# Métadonnées
LABEL maintainer="Yanis Ada"
LABEL description="Microblog Frontend - Next.js App"
LABEL version="1.0"

# Installation des dépendances système pour Next.js
# libc6-compat = compatibilité binaires (requis par sharp)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY package*.json ./

# ───────────────────────────────────────────────────────────────
# STAGE 2: Dependencies (installation)
# ───────────────────────────────────────────────────────────────
FROM base AS dependencies

# Installation de TOUTES les dépendances
RUN npm ci --frozen-lockfile

# ───────────────────────────────────────────────────────────────
# STAGE 3: Development (hot-reload)
# ───────────────────────────────────────────────────────────────
FROM dependencies AS development

# Variables d'environnement
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Copier le code source
COPY . .

# Exposer le port Next.js
EXPOSE 3000

# Commande de développement avec hot-reload
# next dev = Fast Refresh activé
CMD ["npm", "run", "dev"]

# ───────────────────────────────────────────────────────────────
# STAGE 4: Builder (compilation Next.js)
# ───────────────────────────────────────────────────────────────
FROM dependencies AS builder

# Variables d'environnement pour le build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copier le code source
COPY . .

# Build Next.js avec standalone output
# Génère .next/standalone (seulement fichiers nécessaires)
RUN npm run build

# ───────────────────────────────────────────────────────────────
# STAGE 5: Production (image ultra-légère)
# ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Variables d'environnement
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Installer libc6-compat
RUN apk add --no-cache libc6-compat

# Créer utilisateur non-root (sécurité)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis builder

# 1. Standalone server (serveur Next.js minimal)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# 2. Static files (CSS, JS, images optimisées)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 3. Public assets (si présent)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Changer d'utilisateur
USER nextjs

# Exposer le port
EXPOSE 3000

# Variables d'environnement runtime
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Commande de production
# server.js est généré par next build (standalone)
CMD ["node", "server.js"]
