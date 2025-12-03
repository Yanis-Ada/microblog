# ═══════════════════════════════════════════════════════════════
# MAKEFILE - Commandes Docker simplifiées
# Usage: make [commande]
# ═══════════════════════════════════════════════════════════════

# Couleurs pour le terminal
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m # No Color

# Variables
ENV ?= development
COMPOSE_FILES := -f docker-compose.yml

ifeq ($(ENV),development)
	COMPOSE_FILES += -f docker-compose.dev.yml
	ENV_FILE := .env.development
else ifeq ($(ENV),production)
	COMPOSE_FILES += -f docker-compose.prod.yml
	ENV_FILE := .env.production
endif

DOCKER_COMPOSE := docker-compose $(COMPOSE_FILES) --env-file $(ENV_FILE)

# ═══════════════════════════════════════════════════════════════
# COMMANDES PRINCIPALES
# ═══════════════════════════════════════════════════════════════

.PHONY: help
help: ## Afficher cette aide
	@echo "$(GREEN)Microblog - Commandes Docker$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Environnements:$(NC)"
	@echo "  ENV=development (défaut)"
	@echo "  ENV=production"
	@echo ""
	@echo "$(GREEN)Exemples:$(NC)"
	@echo "  make dev              # Démarrer en développement"
	@echo "  make prod             # Démarrer en production"
	@echo "  make logs             # Voir les logs"
	@echo "  make shell-backend    # Terminal dans le backend"

# ───────────────────────────────────────────────────────────────
# Développement
# ───────────────────────────────────────────────────────────────

.PHONY: dev
dev: ## Démarrer en mode développement
	@echo "$(GREEN)🚀 Démarrage en mode développement...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Services démarrés !$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"

.PHONY: dev-build
dev-build: ## Construire et démarrer en mode développement
	@echo "$(GREEN)🔨 Construction des images...$(NC)"
	$(DOCKER_COMPOSE) up -d --build
	@echo "$(GREEN)✅ Services démarrés !$(NC)"

# ───────────────────────────────────────────────────────────────
# Production
# ───────────────────────────────────────────────────────────────

.PHONY: prod
prod: ENV=production
prod: ## Démarrer en mode production
	@echo "$(YELLOW)⚠️  Démarrage en mode PRODUCTION$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Services démarrés en production !$(NC)"

.PHONY: prod-build
prod-build: ENV=production
prod-build: ## Construire et démarrer en mode production
	@echo "$(YELLOW)🔨 Construction des images de production...$(NC)"
	$(DOCKER_COMPOSE) up -d --build
	@echo "$(GREEN)✅ Images construites et services démarrés !$(NC)"

# ───────────────────────────────────────────────────────────────
# Arrêt et nettoyage
# ───────────────────────────────────────────────────────────────

.PHONY: stop
stop: ## Arrêter les services
	@echo "$(YELLOW)⏸️  Arrêt des services...$(NC)"
	$(DOCKER_COMPOSE) stop
	@echo "$(GREEN)✅ Services arrêtés$(NC)"

.PHONY: down
down: ## Arrêter et supprimer les conteneurs
	@echo "$(YELLOW)🗑️  Suppression des conteneurs...$(NC)"
	$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Conteneurs supprimés$(NC)"

.PHONY: clean
clean: ## Nettoyer tout (conteneurs + volumes + images)
	@echo "$(RED)⚠️  ATTENTION: Suppression de TOUT (y compris les données) !$(NC)"
	@read -p "Êtes-vous sûr ? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE) down -v --rmi all; \
		echo "$(GREEN)✅ Nettoyage complet terminé$(NC)"; \
	else \
		echo "$(YELLOW)❌ Annulé$(NC)"; \
	fi

# ───────────────────────────────────────────────────────────────
# Logs et monitoring
# ───────────────────────────────────────────────────────────────

.PHONY: logs
logs: ## Voir les logs de tous les services
	$(DOCKER_COMPOSE) logs -f

.PHONY: logs-frontend
logs-frontend: ## Voir les logs du frontend
	$(DOCKER_COMPOSE) logs -f frontend

.PHONY: logs-backend
logs-backend: ## Voir les logs du backend
	$(DOCKER_COMPOSE) logs -f backend

.PHONY: logs-db
logs-db: ## Voir les logs de PostgreSQL
	$(DOCKER_COMPOSE) logs -f postgres

.PHONY: ps
ps: ## Voir l'état des services
	$(DOCKER_COMPOSE) ps

# ───────────────────────────────────────────────────────────────
# Accès aux conteneurs
# ───────────────────────────────────────────────────────────────

.PHONY: shell-backend
shell-backend: ## Terminal dans le conteneur backend
	$(DOCKER_COMPOSE) exec backend sh

.PHONY: shell-frontend
shell-frontend: ## Terminal dans le conteneur frontend
	$(DOCKER_COMPOSE) exec frontend sh

.PHONY: shell-db
shell-db: ## Terminal PostgreSQL (psql)
	$(DOCKER_COMPOSE) exec postgres psql -U $${POSTGRES_USER:-microblog_user} -d $${POSTGRES_DB:-microblog}

# ───────────────────────────────────────────────────────────────
# Base de données
# ───────────────────────────────────────────────────────────────

.PHONY: db-migrate
db-migrate: ## Exécuter les migrations Prisma
	$(DOCKER_COMPOSE) exec backend npx prisma migrate deploy

.PHONY: db-seed
db-seed: ## Peupler la base de données (si seed existe)
	$(DOCKER_COMPOSE) exec backend npx prisma db seed

.PHONY: db-studio
db-studio: ## Ouvrir Prisma Studio
	$(DOCKER_COMPOSE) exec backend npx prisma studio

.PHONY: db-backup
db-backup: ## Sauvegarder la base de données
	@echo "$(GREEN)💾 Sauvegarde de la base de données...$(NC)"
	@mkdir -p backups
	$(DOCKER_COMPOSE) exec -T postgres pg_dump -U $${POSTGRES_USER:-microblog_user} $${POSTGRES_DB:-microblog} > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✅ Sauvegarde créée dans backups/$(NC)"

# ───────────────────────────────────────────────────────────────
# Rebuild et restart
# ───────────────────────────────────────────────────────────────

.PHONY: restart
restart: ## Redémarrer tous les services
	@echo "$(YELLOW)♻️  Redémarrage des services...$(NC)"
	$(DOCKER_COMPOSE) restart
	@echo "$(GREEN)✅ Services redémarrés$(NC)"

.PHONY: rebuild
rebuild: ## Reconstruire les images
	@echo "$(GREEN)🔨 Reconstruction des images...$(NC)"
	$(DOCKER_COMPOSE) build --no-cache
	@echo "$(GREEN)✅ Images reconstruites$(NC)"

# ───────────────────────────────────────────────────────────────
# Tests
# ───────────────────────────────────────────────────────────────

.PHONY: test
test: ## Lancer les tests (backend)
	$(DOCKER_COMPOSE) exec backend npm test

.PHONY: health
health: ## Vérifier la santé des services
	@echo "$(GREEN)🏥 Vérification de la santé des services...$(NC)"
	@docker ps --filter "name=microblog" --format "table {{.Names}}\t{{.Status}}"

# ───────────────────────────────────────────────────────────────
# Setup initial
# ───────────────────────────────────────────────────────────────

.PHONY: setup
setup: ## Configuration initiale du projet
	@echo "$(GREEN)⚙️  Configuration initiale...$(NC)"
	@if [ ! -f .env.development ]; then \
		echo "$(YELLOW)Création de .env.development...$(NC)"; \
		cp .env.example .env.development; \
	fi
	@echo "$(GREEN)✅ Configuration terminée !$(NC)"
	@echo "$(YELLOW)⚠️  N'oubliez pas de modifier .env.development avec vos valeurs$(NC)"

# Par défaut : afficher l'aide
.DEFAULT_GOAL := help
