# 📚 Documentation API - Microblog

API REST pour la plateforme de microblogging.

**Base URL** : `http://localhost:3001`

---

## 🔐 Authentification

L'API utilise des tokens JWT (JSON Web Tokens) pour l'authentification.

### Format du Token

Pour les routes protégées, inclure le token dans le header :

```
Authorization: Bearer <votre_token_jwt>
```

### Obtenir un Token

Utilisez la route `/api/users/register` ou `/api/users/login` pour obtenir un token.

---

## 👤 Utilisateurs

### POST /api/users/register

Créer un nouveau compte utilisateur.

**Body** :
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "Password123"
}
```

**Validation** :
- `email` : Format email valide
- `username` : 3-30 caractères, alphanumérique et underscores uniquement
- `password` : 8 caractères min, avec majuscule, minuscule et chiffre

**Réponse (201)** :
```json
{
  "message": "Inscription réussie.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "bio": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs** :
- `409` : Email ou username déjà utilisé
- `400` : Données invalides

---

### POST /api/users/login

Se connecter avec un compte existant.

**Body** :
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Réponse (200)** :
```json
{
  "message": "Connexion réussie.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "bio": "Développeur passionné",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs** :
- `401` : Email ou mot de passe incorrect
- `400` : Données invalides

---

### GET /api/users/me/profile

Récupérer le profil de l'utilisateur connecté.

**Headers** : `Authorization: Bearer <token>`

**Réponse (200)** :
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "bio": "Développeur passionné",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T14:20:00.000Z",
  "posts": [
    {
      "id": 5,
      "content": "Mon premier post !",
      "createdAt": "2024-01-16T09:00:00.000Z",
      "updatedAt": "2024-01-16T09:00:00.000Z"
    }
  ]
}
```

**Erreurs** :
- `401` : Non authentifié
- `404` : Utilisateur non trouvé

---

### PUT /api/users/me/profile

Mettre à jour le profil de l'utilisateur connecté.

**Headers** : `Authorization: Bearer <token>`

**Body** :
```json
{
  "username": "newusername",
  "bio": "Ma nouvelle biographie"
}
```

**Validation** :
- `username` (optionnel) : 3-30 caractères, alphanumérique et underscores
- `bio` (optionnel) : Maximum 160 caractères

**Réponse (200)** :
```json
{
  "message": "Profil mis à jour avec succès.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "newusername",
    "bio": "Ma nouvelle biographie",
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
}
```

**Erreurs** :
- `401` : Non authentifié
- `409` : Username déjà pris
- `400` : Données invalides

---

### GET /api/users/:username

Récupérer le profil public d'un utilisateur par son username.

**Paramètres** :
- `username` : Nom d'utilisateur

**Exemple** : `GET /api/users/johndoe`

**Réponse (200)** :
```json
{
  "id": 1,
  "username": "johndoe",
  "bio": "Développeur passionné",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "posts": [
    {
      "id": 5,
      "content": "Mon premier post !",
      "createdAt": "2024-01-16T09:00:00.000Z",
      "updatedAt": "2024-01-16T09:00:00.000Z"
    }
  ]
}
```

**Note** : L'email n'est pas exposé pour respecter la vie privée.

**Erreurs** :
- `404` : Utilisateur non trouvé

---

## 📝 Posts

### GET /api/posts

Récupérer tous les posts de la plateforme (feed global).

**Réponse (200)** :
```json
[
  {
    "id": 1,
    "content": "Découverte de TypeScript aujourd'hui !",
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": "2024-01-15T14:30:00.000Z",
    "author": {
      "id": 1,
      "username": "johndoe",
      "bio": "Développeur passionné"
    }
  },
  {
    "id": 2,
    "content": "Next.js est incroyable 🚀",
    "createdAt": "2024-01-15T15:00:00.000Z",
    "updatedAt": "2024-01-15T15:00:00.000Z",
    "author": {
      "id": 2,
      "username": "janedoe",
      "bio": null
    }
  }
]
```

**Note** : Les posts sont triés par date décroissante (les plus récents en premier).

---

### GET /api/posts/:id

Récupérer un post spécifique par son ID.

**Paramètres** :
- `id` : ID du post

**Exemple** : `GET /api/posts/1`

**Réponse (200)** :
```json
{
  "id": 1,
  "content": "Découverte de TypeScript aujourd'hui !",
  "createdAt": "2024-01-15T14:30:00.000Z",
  "updatedAt": "2024-01-15T14:30:00.000Z",
  "author": {
    "id": 1,
    "username": "johndoe",
    "bio": "Développeur passionné"
  }
}
```

**Erreurs** :
- `404` : Post non trouvé
- `400` : ID invalide

---

### POST /api/posts

Créer un nouveau post.

**Headers** : `Authorization: Bearer <token>`

**Body** :
```json
{
  "content": "Mon nouveau post sur le microblogging !"
}
```

**Validation** :
- `content` : 1-280 caractères

**Réponse (201)** :
```json
{
  "message": "Post créé avec succès.",
  "post": {
    "id": 3,
    "content": "Mon nouveau post sur le microblogging !",
    "createdAt": "2024-01-20T16:00:00.000Z",
    "updatedAt": "2024-01-20T16:00:00.000Z",
    "authorId": 1,
    "author": {
      "id": 1,
      "username": "johndoe",
      "bio": "Développeur passionné"
    }
  }
}
```

**Erreurs** :
- `401` : Non authentifié
- `400` : Contenu invalide (vide ou trop long)

---

### PUT /api/posts/:id

Modifier un post (seulement si vous en êtes l'auteur).

**Headers** : `Authorization: Bearer <token>`

**Paramètres** :
- `id` : ID du post à modifier

**Body** :
```json
{
  "content": "Contenu modifié de mon post"
}
```

**Validation** :
- `content` : 1-280 caractères

**Exemple** : `PUT /api/posts/3`

**Réponse (200)** :
```json
{
  "message": "Post modifié avec succès.",
  "post": {
    "id": 3,
    "content": "Contenu modifié de mon post",
    "createdAt": "2024-01-20T16:00:00.000Z",
    "updatedAt": "2024-01-21T10:30:00.000Z",
    "authorId": 1,
    "author": {
      "id": 1,
      "username": "johndoe",
      "bio": "Développeur passionné"
    }
  }
}
```

**Erreurs** :
- `401` : Non authentifié
- `404` : Post non trouvé
- `403` : Vous n'êtes pas l'auteur de ce post
- `400` : Contenu invalide

**🔐 Sécurité** :
- Vérification stricte de la propriété du post
- Validation Zod du contenu
- Traçabilité : `updatedAt` mis à jour automatiquement (RGPD)

---

### DELETE /api/posts/:id

Supprimer un post (seulement si vous en êtes l'auteur).

**Headers** : `Authorization: Bearer <token>`

**Paramètres** :
- `id` : ID du post à supprimer

**Exemple** : `DELETE /api/posts/3`

**Réponse (200)** :
```json
{
  "message": "Post supprimé avec succès."
}
```

**Erreurs** :
- `401` : Non authentifié
- `404` : Post non trouvé
- `403` : Vous n'êtes pas l'auteur de ce post
- `400` : ID invalide

---

## ❌ Gestion des Erreurs

Toutes les erreurs suivent le même format :

```json
{
  "error": "Message d'erreur descriptif"
}
```

### Codes HTTP utilisés

- `200` : Succès
- `201` : Créé avec succès
- `400` : Requête invalide (mauvaises données)
- `401` : Non authentifié (token manquant ou invalide)
- `403` : Interdit (pas les permissions)
- `404` : Ressource non trouvée
- `409` : Conflit (ex: email déjà utilisé)
- `500` : Erreur serveur

---

## 🧪 Exemples avec cURL

### Inscription
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test1234"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### Créer un post (avec token)
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "content": "Mon premier post via API !"
  }'
```

### Récupérer tous les posts
```bash
curl http://localhost:3001/api/posts
```

### Récupérer son profil (avec token)
```bash
curl http://localhost:3001/api/users/me/profile \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 📊 Limites

- **Post** : Maximum 280 caractères
- **Biographie** : Maximum 160 caractères
- **Username** : 3-30 caractères
- **Token JWT** : Expire après 7 jours

---

## 🔄 Workflow Typique

1. **S'inscrire** : `POST /api/users/register` → Obtenir un token
2. **Se connecter** (sessions suivantes) : `POST /api/users/login` → Obtenir un token
3. **Voir le feed** : `GET /api/posts`
4. **Créer un post** : `POST /api/posts` (avec token)
5. **Voir son profil** : `GET /api/users/me/profile` (avec token)
6. **Modifier son profil** : `PUT /api/users/me/profile` (avec token)
7. **Supprimer un post** : `DELETE /api/posts/:id` (avec token)

---

## 📝 Notes

- Tous les timestamps sont en format ISO 8601 (UTC)
- Les tokens JWT doivent être stockés de manière sécurisée côté client
- L'API utilise CORS et n'accepte que les requêtes du frontend autorisé
- Les mots de passe ne sont jamais retournés par l'API
