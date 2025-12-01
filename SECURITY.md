# 🔐 Sécurité et RGPD - Documentation

Ce document détaille toutes les mesures de sécurité et de conformité RGPD implémentées dans le projet Microblog.

## 🛡️ Sécurité

### 1. Authentification Sécurisée

#### Hachage des mots de passe avec bcrypt
```typescript
// backend/src/utils/password.ts
const SALT_ROUNDS = 12; // Niveau de sécurité élevé

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};
```

**Pourquoi ?**
- Les mots de passe ne sont **jamais** stockés en clair
- Utilisation de bcrypt avec 12 rounds (recommandé par OWASP)
- Même en cas de fuite de la base de données, les mots de passe restent protégés

#### Tokens JWT (JSON Web Tokens)
```typescript
// backend/src/utils/jwt.ts
const JWT_EXPIRES_IN = '7d'; // Expiration après 7 jours

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
```

**Pourquoi ?**
- Authentification stateless (pas besoin de session serveur)
- Tokens signés cryptographiquement
- Expiration automatique après 7 jours
- Stockage côté client dans localStorage (amélioration possible : httpOnly cookies)

### 2. Validation des Données (Zod)

#### Validation stricte des entrées
```typescript
// backend/src/utils/validation.ts

// Mot de passe : 8 caractères min, avec majuscule, minuscule et chiffre
export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  username: z
    .string()
    .min(3).max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
});
```

**Pourquoi ?**
- Prévention des injections SQL (en plus de Prisma qui protège déjà)
- Validation côté serveur (ne jamais faire confiance au client)
- Messages d'erreur clairs pour l'utilisateur
- Respect des bonnes pratiques de sécurité des mots de passe

### 3. Protection CORS

```typescript
// backend/src/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

**Pourquoi ?**
- Accepte uniquement les requêtes du frontend autorisé
- Prévention des attaques Cross-Origin
- Protection contre le CSRF (Cross-Site Request Forgery)

### 4. Middleware d'Authentification

```typescript
// backend/src/middleware/auth.ts
export const authenticateToken = (req, res, next) => {
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
  
  req.user = decoded;
  next();
};
```

**Pourquoi ?**
- Vérification systématique de l'authentification
- Distinction claire entre routes publiques et protégées
- Codes HTTP appropriés (401 pour non authentifié, 403 pour interdit)

### 5. Contrôle d'Accès

```typescript
// backend/src/controllers/postController.ts
export const deletePost = async (req, res) => {
  // Vérifier que le post appartient à l'utilisateur
  if (post.authorId !== req.user.userId) {
    return res.status(403).json({ 
      error: 'Vous n\'êtes pas autorisé à supprimer ce post.' 
    });
  }
  // ...
};
```

**Pourquoi ?**
- Un utilisateur ne peut supprimer que ses propres posts
- Principe du moindre privilège (least privilege)
- Protection contre l'élévation de privilèges

## 📋 Conformité RGPD

### 1. Minimisation des Données

**Principe** : Ne collecter que les données strictement nécessaires

```typescript
// Schema Prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique  // Nécessaire pour connexion
  username  String   @unique  // Nécessaire pour identification
  password  String             // Nécessaire pour sécurité
  bio       String?            // OPTIONNEL - respect du choix utilisateur
  // PAS de données sensibles non nécessaires
}
```

**Données collectées** :
- ✅ Email (pour connexion)
- ✅ Username (pour identification publique)
- ✅ Mot de passe (haché pour sécurité)
- ✅ Biographie (optionnelle)

**Données NON collectées** :
- ❌ Nom/prénom réels
- ❌ Adresse
- ❌ Téléphone
- ❌ Date de naissance
- ❌ Données de navigation/tracking

### 2. Transparence et Traçabilité

```typescript
model User {
  createdAt DateTime @default(now())  // Date de création du compte
  updatedAt DateTime @updatedAt       // Date de dernière modification
}

model Post {
  createdAt DateTime @default(now())  // Date de création
  updatedAt DateTime @updatedAt       // Date de modification
}
```

**Pourquoi ?**
- L'utilisateur peut voir quand son compte a été créé
- Traçabilité des modifications
- Respect du droit à l'information (Article 13 RGPD)

### 3. Droit à l'Effacement

```typescript
// Schema Prisma
model Post {
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

**Fonctionnalité implémentée** :
- Suppression en cascade : quand un utilisateur est supprimé, tous ses posts le sont aussi
- L'utilisateur peut supprimer ses propres posts individuellement

**À implémenter pour conformité totale** :
- Route `DELETE /api/users/me` pour supprimer le compte
- Export des données personnelles (Article 20 - Portabilité)

### 4. Sécurité des Données Personnelles

```typescript
// Mot de passe JAMAIS retourné dans les réponses
const user = await prisma.user.findUnique({
  where: { email: validatedData.email },
  select: {
    id: true,
    email: true,
    username: true,
    bio: true,
    // password n'est PAS inclus
  },
});
```

**Mesures** :
- ✅ Mot de passe haché (bcrypt)
- ✅ Mot de passe jamais exposé dans les API
- ✅ Tokens JWT avec expiration
- ✅ Validation stricte des entrées

### 5. Limitation de la Finalité

**Principe** : Les données ne sont utilisées que pour leur finalité initiale

```typescript
// Les données sont utilisées uniquement pour :
// 1. Authentification (email + password)
// 2. Identification publique (username + bio)
// 3. Attribution des posts (authorId)
```

**Pas d'utilisation secondaire** :
- ❌ Pas de vente de données
- ❌ Pas de publicité ciblée
- ❌ Pas de tracking comportemental
- ❌ Pas de partage avec des tiers

### 6. Consentement Implicite

**Lors de l'inscription** :
- L'utilisateur crée volontairement un compte
- L'acte d'inscription constitue un consentement
- Les données demandées sont minimales et justifiées

**Améliorations possibles** :
- Ajouter une checkbox "J'accepte les conditions d'utilisation"
- Créer une page de politique de confidentialité
- Permettre de refuser certains traitements optionnels

## 🚨 Vulnérabilités Prévenues

### 1. Injection SQL
**Protection** : Prisma ORM avec requêtes paramétrées
```typescript
// ✅ Sécurisé avec Prisma
await prisma.user.findUnique({ where: { email: userEmail } });

// ❌ Vulnérable (non utilisé dans ce projet)
// db.query(`SELECT * FROM users WHERE email = '${userEmail}'`);
```

### 2. Cross-Site Scripting (XSS)
**Protection** : 
- React échappe automatiquement le contenu
- Validation Zod côté serveur
- Pas de `dangerouslySetInnerHTML` utilisé

### 3. Cross-Site Request Forgery (CSRF)
**Protection** :
- CORS configuré strictement
- Authentification par token JWT (pas de cookies de session)

### 4. Brute Force
**Protection partielle** :
- Hachage bcrypt ralentit les tentatives
- **À ajouter** : Rate limiting (ex: express-rate-limit)

### 5. Énumération d'Utilisateurs
**Protection** :
- Message d'erreur générique "Email ou mot de passe incorrect"
- Pas de distinction entre "email inexistant" et "mauvais mot de passe"

## 📊 Résumé des Bonnes Pratiques

| Pratique | Implémenté | Niveau |
|----------|-----------|---------|
| Hachage bcrypt (12 rounds) | ✅ | 🟢 Excellent |
| JWT avec expiration | ✅ | 🟢 Bon |
| Validation Zod | ✅ | 🟢 Excellent |
| CORS configuré | ✅ | 🟢 Bon |
| Minimisation données | ✅ | 🟢 Excellent |
| Suppression cascade | ✅ | 🟢 Bon |
| Horodatage | ✅ | 🟢 Bon |
| HTTPS | ⚠️ | 🟡 À configurer en prod |
| Rate Limiting | ❌ | 🔴 À implémenter |
| Logs de sécurité | ❌ | 🔴 À implémenter |
| 2FA (Two-Factor Auth) | ❌ | 🟡 Nice to have |

## 🎯 Recommandations pour la Production

### Essentielles
1. **HTTPS** : Obligatoire pour protéger les communications
2. **Rate Limiting** : Limiter les tentatives de connexion/inscription
3. **Logs** : Monitoring des tentatives d'accès suspectes
4. **Secret JWT fort** : Générer un secret cryptographique long
5. **Base de données sécurisée** : PostgreSQL avec chiffrement au repos

### Optionnelles mais recommandées
1. **Cookies httpOnly** : Au lieu de localStorage pour les tokens
2. **Refresh tokens** : Pour renouveler les tokens sans redemander le mot de passe
3. **Vérification email** : S'assurer que l'email appartient à l'utilisateur
4. **2FA** : Authentification à deux facteurs pour plus de sécurité
5. **Password reset** : Fonction "mot de passe oublié"

## 📖 Références

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [RGPD - Texte officiel](https://www.cnil.fr/fr/reglement-europeen-protection-donnees)
- [Bcrypt Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
