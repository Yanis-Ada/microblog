# 📝 Microblog - Plateforme de Microblogging Sécurisée

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

Une plateforme de microblogging moderne et sécurisée construite avec TypeScript, Next.js, SQLite et Prisma. Projet conforme aux meilleures pratiques de **cybersécurité** et **RGPD**.

---

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- ✅ Inscription et connexion sécurisées
- ✅ Hachage bcrypt des mots de passe (12 rounds)
- ✅ Authentification JWT avec expiration (7 jours)
- ✅ Validation stricte des entrées (Zod)
- ✅ Protection CORS
- ✅ Contrôle d'accès basé sur les rôles

### 👤 Gestion de Profil
- ✅ Profil utilisateur avec biographie personnalisable
- ✅ Modification du username et de la bio
- ✅ Visualisation des statistiques (nombre de posts)
- ✅ Avatar avec initiale de l'utilisateur

### 📝 Système de Posts
- ✅ Création de posts (max 280 caractères)
- ✅ Suppression de ses propres posts
- ✅ Feed global de tous les posts
- ✅ Posts triés par date décroissante

### 📋 Conformité RGPD
- ✅ Minimisation des données collectées
- ✅ Transparence (horodatage)
- ✅ Droit à l'effacement (suppression en cascade)
- ✅ Sécurité des données personnelles

---

## 🏗️ Architecture Technique

### Monorepo Structure
```
microblog/
├── backend/                    # API REST TypeScript + Express
│   ├── src/
│   │   ├── controllers/        # Logique métier (User, Post)
│   │   ├── middleware/         # Auth JWT
│   │   ├── routes/             # Définition des routes API
│   │   ├── utils/              # JWT, bcrypt, validation Zod
│   │   └── index.ts            # Point d'entrée serveur
│   ├── prisma/
│   │   └── schema.prisma       # Schéma de base de données
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                    # Variables d'environnement
│
└── frontend/                   # Application Next.js 15
    ├── src/
    │   └── app/
    │       ├── components/     # Navbar
    │       ├── page.tsx        # Accueil (feed)
    │       ├── register/       # Inscription
    │       ├── login/          # Connexion
    │       ├── profile/        # Profil utilisateur
    │       ├── edit-profile/   # Édition profil
    │       └── create-post/    # Création de post
    ├── package.json
    ├── tailwind.config.ts
    └── .env.local              # Variables d'environnement
```

### Stack Technologique

**Backend**
- TypeScript, Express.js, Prisma ORM, SQLite
- bcrypt (hachage), jsonwebtoken (JWT), Zod (validation)
- CORS (protection cross-origin)

**Frontend**
- Next.js 15 (App Router), TypeScript, Tailwind CSS
- Axios (requêtes HTTP), React Hooks

---

## 🚀 Installation Rapide

### Prérequis
- Node.js v18+ 
- npm ou yarn

### 1️⃣ Installation du Backend

```bash
cd microblog/backend

# Installer les dépendances
npm install

# Générer le client Prisma
npm run prisma:generate

# Créer la base de données et exécuter les migrations
npm run prisma:migrate

# Démarrer le serveur (http://localhost:3001)
npm run dev
```

### 2️⃣ Installation du Frontend

Dans un **nouveau terminal** :

```bash
cd microblog/frontend

# Installer les dépendances
npm install

# Démarrer l'application (http://localhost:3000)
npm run dev
```

### 3️⃣ Utilisation

1. Ouvrir http://localhost:3000
2. Cliquer sur **"Inscription"** pour créer un compte
3. Se connecter avec email et mot de passe
4. Cliquer sur **"Nouveau Post"** pour publier
5. Consulter **"Mon Profil"** pour voir vos posts

---

## 📚 Documentation Complète

| Document | Description |
|----------|-------------|
| **[PROJET.md](./PROJET.md)** | Vue d'ensemble complète du projet |
| **[INSTALLATION.md](./INSTALLATION.md)** | Guide d'installation détaillé |
| **[SECURITY.md](./SECURITY.md)** | Documentation sécurité et RGPD |
| **[API.md](./API.md)** | Documentation API REST complète |

---

## 🔐 Sécurité

### Mesures Implémentées

| Mesure | Niveau | Description |
|--------|--------|-------------|
| Hachage bcrypt | 🟢 Excellent | 12 rounds (OWASP recommandé) |
| JWT avec expiration | 🟢 Bon | Tokens signés, expiration 7 jours |
| Validation Zod | 🟢 Excellent | Validation stricte serveur |
| Protection CORS | 🟢 Bon | Frontend autorisé uniquement |
| Contrôle d'accès | 🟢 Excellent | Autorisations basées sur rôles |
| Prisma ORM | 🟢 Excellent | Protection injection SQL |

### Validation des Mots de Passe
- ✅ 8 caractères minimum
- ✅ Au moins une majuscule
- ✅ Au moins une minuscule
- ✅ Au moins un chiffre

---

## 📋 Variables d'Environnement

### Backend (`backend/.env`)
```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="votre_secret_jwt_tres_long_et_complexe"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**⚠️ Important** : Changer `JWT_SECRET` en production avec :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend (`frontend/.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📡 API Endpoints

### 🔓 Routes Publiques
- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/posts` - Récupérer tous les posts
- `GET /api/posts/:id` - Récupérer un post
- `GET /api/users/:username` - Profil public

### 🔒 Routes Protégées (JWT requis)
- `GET /api/users/me/profile` - Mon profil
- `PUT /api/users/me/profile` - Modifier mon profil
- `POST /api/posts` - Créer un post
- `DELETE /api/posts/:id` - Supprimer un post

📖 Voir [API.md](./API.md) pour la documentation complète

---

## 🧪 Commandes Utiles

### Backend
```bash
npm run dev              # Mode développement
npm run build            # Compiler TypeScript
npm run start            # Production
npm run prisma:studio    # Interface base de données
npm run prisma:generate  # Générer client Prisma
npm run prisma:migrate   # Exécuter migrations
```

### Frontend
```bash
npm run dev     # Mode développement
npm run build   # Build production
npm run start   # Serveur production
npm run lint    # Vérifier le code
```

---

## 🎯 Roadmap

### Court Terme
- [ ] Rate limiting (protection brute force)
- [ ] Vérification email lors de l'inscription
- [ ] Fonction "mot de passe oublié"
- [ ] Tests unitaires et d'intégration

### Moyen Terme
- [ ] Système de "J'aime" sur les posts
- [ ] Commentaires sur les posts
- [ ] Suivre d'autres utilisateurs
- [ ] Recherche d'utilisateurs et posts
- [ ] Upload d'avatar personnalisé

### Long Terme
- [ ] 2FA (authentification à deux facteurs)
- [ ] WebSockets (mises à jour temps réel)
- [ ] Migration vers PostgreSQL
- [ ] Docker & CI/CD

---

## 🛡️ Conformité RGPD

### ✅ Principes Respectés
1. **Minimisation** : Données essentielles uniquement
2. **Transparence** : Horodatage, traçabilité
3. **Sécurité** : Mots de passe hachés, JWT
4. **Droit à l'effacement** : Suppression en cascade
5. **Limitation** : Pas de revente, tracking ou partage

### 📊 Données Collectées
- Email (connexion)
- Username (identification)
- Mot de passe (haché)
- Biographie (optionnelle)

**Aucune donnée sensible** : Pas de nom réel, adresse, téléphone, etc.

---

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
# Vérifier les dépendances
npm install

# Régénérer Prisma
npm run prisma:generate

# Vérifier le fichier .env
```

### Erreur CORS
- Vérifier que `FRONTEND_URL` dans backend/.env correspond à l'URL du frontend
- Vérifier que le backend tourne sur le port 3001

### Le frontend ne se connecte pas
- Vérifier que le backend tourne
- Vérifier `.env.local` du frontend
- Consulter la console navigateur (F12)

---

## 📖 Exemples d'Utilisation (cURL)

```bash
# Inscription
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Test1234"}'

# Connexion
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# Créer un post (avec token)
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{"content":"Mon premier post !"}'
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📄 Licence

**ISC License** - Libre d'utilisation et de modification

---

## 👨‍💻 Auteur

Développé avec ❤️ en TypeScript

**Technologies** : Next.js, Prisma, Express, bcrypt, JWT, Zod, Tailwind CSS

---

## 📞 Support & Questions

- 📖 [Documentation Installation](./INSTALLATION.md)
- 🔐 [Documentation Sécurité](./SECURITY.md)
- 📡 [Documentation API](./API.md)
- 📝 [Vue d'ensemble Projet](./PROJET.md)

---

**⭐ N'oubliez pas de mettre une étoile si le projet vous plaît !**
