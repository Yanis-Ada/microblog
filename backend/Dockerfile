# ═══════════════════════════════════════════════════════════════
# DOCKERFILE BACKEND - Multi-stage Build
# Architecture: Node.js + TypeScript + Express + Prisma
# ═══════════════════════════════════════════════════════════════

# ───────────────────────────────────────────────────────────────
# STAGE 1: Base (commune dev + prod)
# ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS base

# Métadonnées de l'image
LABEL maintainer="Yanis Ada"
LABEL description="Microblog Backend API"
LABEL version="1.0"

# Installation d'OpenSSL (requis par Prisma)
# Alpine n'inclut pas OpenSSL par défaut
RUN apk add --no-cache openssl

# Définir le répertoire de travail
WORKDIR /app

# Copier UNIQUEMENT package.json et package-lock.json
# Pourquoi séparément ? → Optimisation du cache Docker
# Si le code change mais pas les deps → cache réutilisé
COPY package*.json ./

# ───────────────────────────────────────────────────────────────
# STAGE 2: Dependencies (installation des dépendances)
# ───────────────────────────────────────────────────────────────
FROM base AS dependencies

# Installation de TOUTES les dépendances (dev + prod)
# --frozen-lockfile = utilise exactement package-lock.json
# Garantit versions identiques partout
RUN npm ci --frozen-lockfile

# ───────────────────────────────────────────────────────────────
# STAGE 3: Development (environnement de développement)
# ───────────────────────────────────────────────────────────────
FROM dependencies AS development

# Variables d'environnement pour développement
ENV NODE_ENV=development

# Copier le code source
COPY . .

# Générer le client Prisma
# Prisma génère du code TypeScript depuis schema.prisma
RUN npx prisma generate

# Exposer le port du backend
EXPOSE 3001

# Commande de développement avec hot-reload
# tsx watch = redémarre automatiquement à chaque changement
CMD ["npm", "run", "dev"]

# ───────────────────────────────────────────────────────────────
# STAGE 4: Builder (compilation TypeScript)
# ───────────────────────────────────────────────────────────────
FROM dependencies AS builder

# Copier le code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Compiler TypeScript → JavaScript
# Résultat dans /app/dist
RUN npm run build

# ───────────────────────────────────────────────────────────────
# STAGE 5: Production (image finale optimisée)
# ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Variables d'environnement
ENV NODE_ENV=production

# Installation d'OpenSSL pour Prisma
RUN apk add --no-cache openssl

# Créer un utilisateur non-root pour la sécurité
# Par défaut Docker run en root = risque de sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copier package*.json
COPY --chown=nodejs:nodejs package*.json ./

# Installer UNIQUEMENT les dépendances de production
# --omit=dev = ignore devDependencies
# Image plus légère !
RUN npm ci --omit=dev --frozen-lockfile

# Copier Prisma schema (nécessaire pour les migrations)
COPY --chown=nodejs:nodejs prisma ./prisma

# Générer le client Prisma en production
RUN npx prisma generate

# Copier le code compilé depuis le stage builder
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist

# Changer d'utilisateur (sécurité)
USER nodejs

# Exposer le port
EXPOSE 3001

# Commande de production
# node dist/index.js = exécute le JavaScript compilé
CMD ["node", "dist/index.js"]
