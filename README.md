# Antunes — Front-end

Front-end de Antunes, une marketplace type "Vinted" dédiée à la revente d'appareils, pièces et accessoires électroniques (smartphones, PC, consoles, composants...). Projet de fin d'année réalisé en stack **MERN**, ce dépôt contient uniquement la partie **front**, séparée du back (API Node/Express + MongoDB) qui vit dans un dépôt distinct.

## Stack technique

- [React 19](https://react.dev/) + [React Router 7](https://reactrouter.com/) pour le routing
- [Vite](https://vite.dev/) comme bundler et serveur de développement
- [Sass (Dart Sass)](https://sass-lang.com/) + [Bootstrap 5](https://getbootstrap.com/) pour le style et la grille responsive
- [ESLint 9](https://eslint.org/) (flat config) pour la qualité du code

Le front n'est pas encore connecté au back : les données affichées proviennent de `src/data/mockProducts.js`.

## Structure du projet

```
src/
├── components/   # Composants réutilisables (Header, Footer, Layout, ProductCard)
├── pages/        # Une page par route (Home, Catalog, ProductDetails, Login...)
├── hooks/        # Hooks custom (thème sombre, statut d'authentification, effet curseur)
├── constants/    # Constantes partagées (navigation)
├── data/         # Données mockées en attendant l'API
└── styles/       # Feuilles de style SCSS
```

## Installation

```bash
npm install
```

## Scripts disponibles

| Commande          | Description                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`      | Lance le serveur de développement avec hot-reload |
| `npm run build`     | Build de production dans `dist/`                  |
| `npm run preview`   | Prévisualise le build de production en local       |
| `npm run lint`      | Vérifie le code avec ESLint                        |

## Développement

```bash
npm run dev
```

Le site est alors disponible sur `http://localhost:5173`.
