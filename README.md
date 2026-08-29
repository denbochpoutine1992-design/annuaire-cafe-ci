# Annuaire du café ivoirien

Application web complète : annuaire des vendeurs de café en Côte d'Ivoire, avec
comptes vendeurs, upload de photos, carte interactive et avis clients.

## Stack technique

- **Next.js 14** (App Router, TypeScript) — frontend et API
- **PostgreSQL** + **Prisma** — base de données
- **Sessions JWT en cookie httpOnly** — authentification (sans dépendance externe)
- **Leaflet / OpenStreetMap** — carte (gratuit, sans clé API)
- **Cloudinary** — hébergement des photos (compte gratuit)
- **Tailwind CSS** — mise en page

## 1. Installer les dépendances

```bash
npm install
```

## 2. Créer une base de données Postgres

La façon la plus simple et gratuite : [Neon](https://neon.tech) ou
[Supabase](https://supabase.com). Créez un projet, copiez l'URL de connexion.

## 3. Configurer Cloudinary (pour les photos)

1. Créez un compte gratuit sur [cloudinary.com](https://cloudinary.com)
2. Dans **Settings → Upload → Upload presets**, créez un preset en mode
   **Unsigned** (nécessaire pour l'upload direct depuis le navigateur)
3. Notez votre `cloud name` et le nom du preset

## 4. Variables d'environnement

Copiez `.env.example` vers `.env` et remplissez :

```bash
cp .env.example .env
```

- `DATABASE_URL` — l'URL Postgres de l'étape 2
- `AUTH_SECRET` — une chaîne aléatoire longue, générez-la avec `openssl rand -base64 32`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` et `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — de l'étape 3

## 5. Créer les tables

```bash
npm run db:push
```

## 6. Lancer en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## 7. Déployer en production (Vercel)

1. Poussez ce projet sur GitHub
2. Sur [vercel.com](https://vercel.com), importez le dépôt
3. Ajoutez les mêmes variables d'environnement que dans `.env` (Settings → Environment Variables)
4. Déployez

Vercel exécute automatiquement `prisma generate` au build (voir `postinstall`
dans `package.json`). Si c'est la première fois que la base est connectée à
Vercel, lancez `npm run db:push` une fois en local (pointé vers la base de
production) pour créer les tables.

## Fonctionnalités

- **Annuaire public** : recherche, filtres par ville/catégorie, vue liste ou carte
- **Comptes vendeurs** : inscription, connexion, tableau de bord (`/dashboard`)
- **Gestion de fiche** : créer, modifier, supprimer, ajouter/supprimer des photos, positionner sur la carte
- **Avis clients** : notation 1 à 5 étoiles + commentaire, ouverts à tous les visiteurs (sans compte)

## Limites connues / pistes d'amélioration

- Les avis ne sont pas modérés — à ajouter si le trafic augmente (signalement, suppression par l'administrateur)
- Pas de récupération de mot de passe par email — à ajouter avec un service comme Resend
- Un seul rôle (vendeur) — pas d'administrateur pour modérer l'ensemble du site
- Les photos sont hébergées gratuitement sur Cloudinary (limite : 25 crédits/mois sur le plan gratuit, largement suffisant pour démarrer)
