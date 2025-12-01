# 🚀 Guide d'Installation - Microblog

Ce guide vous accompagne pour installer et lancer le projet de microblogging.

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn

## 🔧 Installation

### 1. Installation du Backend

```bash
# Se placer dans le dossier backend
cd microblog/backend

# Installer les dépendances
npm install

# Générer le client Prisma
npm run prisma:generate

# Créer la base de données et exécuter les migrations
npm run prisma:migrate

# (Optionnel) Ouvrir Prisma Studio pour visualiser la base de données
npm run prisma:studio
```

### 2. Installation du Frontend

```bash
# Se placer dans le dossier frontend
cd ../frontend

# Installer les dépendances
npm install
```

## ▶️ Lancement du Projet

### Démarrer le Backend (Port 3001)

```bash
cd backend
npm run dev
```

Le serveur démarre sur http://localhost:3001

### Démarrer le Frontend (Port 3000)

Dans un nouveau terminal :

```bash
cd frontend
npm run dev
```

L'application démarre sur http://localhost:3000

## 🎯 Utilisation

1. **Inscription** : Créez un compte sur `/register`
2. **Connexion** : Connectez-vous sur `/login`
3. **Créer un post** : Partagez vos pensées sur `/create-post`
4. **Voir votre profil** : Consultez vos posts sur `/profile`
5. **Modifier votre profil** : Éditez votre biographie sur `/edit-profile`
6. **Page d'accueil** : Découvrez tous les posts sur `/`

## 🔐 Sécurité Implémentée

### Authentification
- ✅ **Hachage bcrypt** : Mots de passe hachés avec 12 rounds
- ✅ **JWT** : Tokens d'authentification sécurisés avec expiration (7 jours)
- ✅ **Validation Zod** : Validation stricte des données côté serveur

### Protection des données (RGPD)
- ✅ **Minimisation des données** : Seules les données nécessaires sont collectées
- ✅ **Champs optionnels** : La biographie est facultative
- ✅ **Horodatage** : Dates de création et modification trackées
- ✅ **Suppression en cascade** : Les posts sont supprimés avec l'utilisateur

### Validation des entrées
- ✅ **Email** : Validation du format email
- ✅ **Mot de passe** : 8 caractères min, avec majuscule, minuscule et chiffre
- ✅ **Username** : 3-30 caractères, alphanumérique et underscores uniquement
- ✅ **Post** : Maximum 280 caractères
- ✅ **Biographie** : Maximum 160 caractères

### Protection CORS
- ✅ Configuration CORS pour n'accepter que le frontend autorisé

## 📚 API Endpoints

### Authentification & Utilisateurs
- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/users/me/profile` - Récupérer son profil (authentifié)
- `PUT /api/users/me/profile` - Modifier son profil (authentifié)
- `GET /api/users/:username` - Récupérer un profil utilisateur

### Posts
- `GET /api/posts` - Récupérer tous les posts
- `GET /api/posts/:id` - Récupérer un post spécifique
- `POST /api/posts` - Créer un post (authentifié)
- `DELETE /api/posts/:id` - Supprimer un post (authentifié, auteur uniquement)

## 🗄️ Structure de la Base de Données

### Table `users`
- `id` : Identifiant unique
- `email` : Email unique
- `username` : Nom d'utilisateur unique
- `password` : Mot de passe haché
- `bio` : Biographie (optionnelle)
- `createdAt` : Date de création
- `updatedAt` : Date de dernière modification

### Table `posts`
- `id` : Identifiant unique
- `content` : Contenu du post (max 280 caractères)
- `authorId` : Référence vers l'utilisateur
- `createdAt` : Date de création
- `updatedAt` : Date de dernière modification

## 🛠️ Technologies Utilisées

### Backend
- **TypeScript** : Typage statique
- **Express** : Framework web
- **Prisma** : ORM pour SQLite
- **SQLite** : Base de données
- **bcrypt** : Hachage de mots de passe
- **jsonwebtoken** : Authentification JWT
- **Zod** : Validation de schémas
- **CORS** : Protection cross-origin

### Frontend
- **Next.js 15** : Framework React
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling
- **Axios** : Client HTTP

## ⚠️ Important pour la Production

Avant de déployer en production :

1. **Changez le JWT_SECRET** dans `.env` du backend
2. **Utilisez une vraie base de données** (PostgreSQL, MySQL) au lieu de SQLite
3. **Configurez HTTPS** pour les communications sécurisées
4. **Ajoutez un rate limiting** pour prévenir les abus
5. **Mettez en place des logs** pour le monitoring
6. **Configurez les CORS** avec l'URL exacte de votre frontend en production

## 📝 Commandes Utiles

```bash
# Backend
npm run dev          # Démarrer en mode développement
npm run build        # Compiler TypeScript
npm run start        # Démarrer en production
npm run prisma:studio # Ouvrir Prisma Studio

# Frontend
npm run dev          # Démarrer en mode développement
npm run build        # Build pour production
npm run start        # Démarrer le build de production
npm run lint         # Vérifier le code
```

## 🐛 Dépannage

### Le backend ne démarre pas
- Vérifiez que les dépendances sont installées : `npm install`
- Vérifiez que Prisma est généré : `npm run prisma:generate`
- Vérifiez le fichier `.env`

### Le frontend ne se connecte pas au backend
- Vérifiez que le backend tourne sur le port 3001
- Vérifiez le fichier `.env.local` du frontend
- Vérifiez la console du navigateur pour les erreurs

### Erreur de CORS
- Vérifiez que `FRONTEND_URL` dans le backend `.env` correspond à l'URL du frontend

## 📖 Licence

ISC
