# 📝 Microblog - Projet de Microblogging Sécurisé

## 🎯 Description du Projet

Microblog est une plateforme de microblogging moderne et sécurisée, similaire à Twitter/X, permettant aux utilisateurs de partager des pensées courtes (280 caractères max). Le projet est construit avec les technologies web les plus récentes et suit les meilleures pratiques en matière de sécurité et de protection des données (RGPD).

## ✨ Fonctionnalités Principales

### Pour les Visiteurs (Non connectés)
- ✅ **Page d'accueil** : Voir tous les posts de la plateforme
- ✅ **Profils publics** : Consulter le profil et les posts d'un utilisateur

### Pour les Utilisateurs Connectés
- ✅ **Inscription** : Créer un compte sécurisé
- ✅ **Connexion** : S'authentifier avec email et mot de passe
- ✅ **Mon profil** : Voir son profil avec tous ses posts
- ✅ **Édition du profil** : Modifier son username et sa biographie
- ✅ **Créer des posts** : Partager des pensées (max 280 caractères)
- ✅ **Supprimer ses posts** : Gérer son contenu

## 🏗️ Architecture Technique

### Monorepo Structure
```
microblog/
├── backend/          # API REST en TypeScript
│   ├── src/
│   │   ├── controllers/    # Logique métier
│   │   ├── routes/         # Définition des routes
│   │   ├── middleware/     # Authentification, validation
│   │   └── utils/          # Utilitaires (JWT, bcrypt, validation)
│   └── prisma/
│       └── schema.prisma   # Schéma de base de données
│
└── frontend/         # Application Next.js
    └── src/
        └── app/
            ├── components/     # Composants réutilisables
            ├── page.tsx        # Page d'accueil
            ├── register/       # Page d'inscription
            ├── login/          # Page de connexion
            ├── profile/        # Page de profil
            ├── edit-profile/   # Édition du profil
            └── create-post/    # Création de post
```

### Technologies Backend
- **TypeScript** : Langage typé pour plus de sécurité
- **Express.js** : Framework web minimaliste et performant
- **Prisma** : ORM moderne pour SQLite
- **SQLite** : Base de données embarquée (facile pour le développement)
- **bcrypt** : Hachage sécurisé des mots de passe (12 rounds)
- **jsonwebtoken** : Gestion de l'authentification JWT
- **Zod** : Validation de schémas TypeScript-first
- **CORS** : Protection contre les requêtes cross-origin

### Technologies Frontend
- **Next.js 15** : Framework React avec App Router
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utility-first
- **Axios** : Client HTTP pour les appels API
- **React Hooks** : useState, useEffect, useRouter

## 🗄️ Modèle de Données

### Utilisateur (User)
```typescript
{
  id: number;           // ID unique auto-incrémenté
  email: string;        // Email unique (pour connexion)
  username: string;     // Nom d'utilisateur unique (public)
  password: string;     // Mot de passe haché (bcrypt)
  bio?: string;         // Biographie optionnelle (max 160 caractères)
  createdAt: Date;      // Date de création du compte
  updatedAt: Date;      // Date de dernière modification
  posts: Post[];        // Liste des posts de l'utilisateur
}
```

### Post
```typescript
{
  id: number;           // ID unique auto-incrémenté
  content: string;      // Contenu (max 280 caractères)
  authorId: number;     // Référence vers l'utilisateur
  author: User;         // Relation avec l'utilisateur
  createdAt: Date;      // Date de création
  updatedAt: Date;      // Date de modification
}
```

## 🔐 Sécurité Implémentée

### 1. Authentification Forte
- **Hachage bcrypt** : Mots de passe hachés avec 12 rounds (standard OWASP)
- **JWT sécurisés** : Tokens signés cryptographiquement avec expiration (7 jours)
- **Validation stricte** : Mot de passe 8+ caractères avec majuscule, minuscule et chiffre

### 2. Protection des Données
- **Prisma ORM** : Protection automatique contre les injections SQL
- **Validation Zod** : Validation côté serveur de toutes les entrées
- **CORS configuré** : Accepte uniquement le frontend autorisé
- **Pas de mot de passe exposé** : Jamais retourné dans les réponses API

### 3. Contrôle d'Accès
- **Middleware d'authentification** : Vérification systématique du token JWT
- **Autorisations** : Un utilisateur ne peut modifier/supprimer que son contenu
- **Routes protégées** : Distinction claire entre public et privé

### 4. Codes HTTP Appropriés
- `200` : Succès
- `201` : Créé
- `401` : Non authentifié
- `403` : Interdit
- `404` : Non trouvé
- `409` : Conflit (ex: email déjà utilisé)

## 📋 Conformité RGPD

### Principes Respectés

#### 1. Minimisation des Données
- Collecte uniquement des données nécessaires : email, username, password
- Biographie optionnelle (respecte le choix de l'utilisateur)
- Pas de tracking, cookies tiers ou données inutiles

#### 2. Transparence
- Horodatage (`createdAt`, `updatedAt`) pour traçabilité
- L'utilisateur voit quand son compte a été créé

#### 3. Sécurité
- Mots de passe hachés (jamais en clair)
- JWT avec expiration
- HTTPS recommandé en production

#### 4. Droit à l'Effacement
- Suppression en cascade : posts supprimés avec l'utilisateur
- Utilisateur peut supprimer ses posts individuellement

#### 5. Limitation de la Finalité
- Données utilisées uniquement pour authentification et publication
- Pas de vente, partage ou utilisation secondaire

## 🚀 Guide de Démarrage Rapide

### Installation

```bash
# Backend
cd microblog/backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev  # Démarre sur http://localhost:3001

# Frontend (dans un autre terminal)
cd microblog/frontend
npm install
npm run dev  # Démarre sur http://localhost:3000
```

### Utilisation

1. Ouvrir http://localhost:3000
2. Cliquer sur "Inscription" pour créer un compte
3. Se connecter avec email et mot de passe
4. Créer des posts depuis "Nouveau Post"
5. Voir son profil et éditer sa biographie

## 📚 Documentation Complète

- **[INSTALLATION.md](./INSTALLATION.md)** : Guide d'installation détaillé
- **[SECURITY.md](./SECURITY.md)** : Documentation sécurité et RGPD
- **[API.md](./API.md)** : Documentation complète de l'API REST

## 🎨 Captures d'Écran des Pages

### Page d'Accueil (/)
- Liste de tous les posts
- Avatar avec initiale de l'utilisateur
- Nom d'utilisateur et biographie
- Date de publication

### Page d'Inscription (/register)
- Formulaire avec email, username, password, confirmation
- Validation en temps réel
- Messages d'erreur clairs
- Redirection automatique après inscription

### Page de Connexion (/login)
- Formulaire simple (email + password)
- Gestion des erreurs
- Lien vers inscription

### Page de Profil (/profile)
- Avatar avec initiale
- Username et biographie
- Date d'inscription
- Liste de tous les posts de l'utilisateur
- Bouton de suppression pour chaque post
- Bouton "Modifier le profil"

### Page d'Édition (/edit-profile)
- Modification du username
- Modification de la biographie (compteur de caractères)
- Validation en temps réel
- Boutons "Enregistrer" et "Annuler"

### Page Nouveau Post (/create-post)
- Zone de texte avec limite 280 caractères
- Compteur de caractères (avec changement de couleur)
- Conseils d'utilisation
- Boutons "Publier" et "Annuler"

## 🎯 Améliorations Futures Possibles

### Fonctionnalités
- [ ] Fonction "J'aime" sur les posts
- [ ] Commentaires sur les posts
- [ ] Suivre d'autres utilisateurs (followers/following)
- [ ] Timeline personnalisée (posts des utilisateurs suivis)
- [ ] Recherche d'utilisateurs et de posts
- [ ] Hashtags
- [ ] Mentions (@username)
- [ ] Upload d'avatar personnalisé
- [ ] Mode sombre

### Sécurité
- [ ] Rate limiting (limitation du nombre de requêtes)
- [ ] Vérification email lors de l'inscription
- [ ] Fonction "mot de passe oublié"
- [ ] 2FA (authentification à deux facteurs)
- [ ] Cookies httpOnly au lieu de localStorage
- [ ] Refresh tokens
- [ ] Logs de sécurité

### RGPD
- [ ] Page politique de confidentialité
- [ ] Conditions d'utilisation
- [ ] Export des données personnelles
- [ ] Route DELETE pour supprimer le compte
- [ ] Historique des connexions

### Technique
- [ ] Migration vers PostgreSQL pour la production
- [ ] Docker pour le déploiement
- [ ] CI/CD (GitHub Actions)
- [ ] Tests unitaires et d'intégration
- [ ] Documentation OpenAPI/Swagger
- [ ] WebSockets pour les mises à jour en temps réel
- [ ] Pagination des posts
- [ ] Cache avec Redis

## 👥 Cas d'Usage

### Utilisateur Nouveau
1. Visite la page d'accueil → Voit tous les posts publics
2. Clique sur "Inscription" → Crée un compte
3. Automatiquement connecté → Redirigé vers l'accueil
4. Clique sur "Nouveau Post" → Partage sa première pensée
5. Clique sur "Mon Profil" → Voit son post publié

### Utilisateur Existant
1. Clique sur "Connexion" → Entre email et mot de passe
2. Consulte le feed → Découvre les nouveaux posts
3. Clique sur "Mon Profil" → Vérifie ses statistiques
4. Clique sur "✏️ Modifier le profil" → Ajoute une biographie
5. Publie plusieurs posts → Voit son compteur de posts augmenter
6. Supprime un ancien post → Post retiré immédiatement

### Administrateur/Développeur
1. Clone le repository
2. Installe les dépendances (backend + frontend)
3. Lance les migrations Prisma
4. Démarre les serveurs de développement
5. Ouvre Prisma Studio → Visualise la base de données
6. Consulte les logs → Monitore l'activité

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

ISC - Libre d'utilisation et de modification

## 📞 Support

Pour toute question ou problème :
- Consulter la [documentation d'installation](./INSTALLATION.md)
- Consulter la [documentation de sécurité](./SECURITY.md)
- Consulter la [documentation API](./API.md)

---

**Développé avec ❤️ en TypeScript, Next.js et Prisma**
