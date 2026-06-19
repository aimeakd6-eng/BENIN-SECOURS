# BENIN SECOURS - Plateforme d'Assistance Routiere

Application complete composee de 2 parties :
- **Dashboard Admin** (Next.js 14) - Gestion des prestataires, demandes, interventions, paiements, avis, wallet et journal d'audit.
- **Application Client PWA** (React 18 + Vite) - Application mobile web progressive pour les usagers en panne.

## Base de Donnees

Supabase deja configuree :
- URL : https://yjoyalkuxobdemmrralj.supabase.co
- Tables : profiles, prestataires, demandes, interventions, paiements, avis, admin_actions, retraits_wallet
- Fonction RPC : get_prestataires_proches

## PARTIE 1 - DASHBOARD ADMIN (Next.js 14)

### Structure
```
benin-secours-admin/
├── src/app/           # Pages (login, dashboard, prestataires, demandes, interventions, paiements, avis, wallet, journal)
├── src/components/    # Sidebar, Header, StatCard, PrestataireCard, PrestataireForm
├── src/lib/           # Client Supabase + Types TypeScript
```

### Installation
```bash
cd benin-secours-admin
npm install
npm run dev     # localhost:3000
```

### Pages
- `/login` - Connexion administrateur
- `/dashboard` - Statistiques et graphiques
- `/prestataires` - Liste avec filtres (statut, service, recherche)
- `/prestataires/nouveau` - Formulaire KYC en 4 etapes
- `/prestataires/[id]` - Detail avec actions (valider/suspendre/rejeter/reactiver)
- `/demandes` - Suivi des demandes d'assistance
- `/interventions` - Suivi des interventions
- `/paiements` - Gestion des transactions
- `/avis` - Evaluations des prestataires
- `/wallet` - Soldes et demandes de retrait
- `/journal` - Historique des actions admin

## PARTIE 2 - APPLICATION CLIENT PWA (React 18 + Vite)

### Structure
```
benin-secours-client/
├── public/            # manifest.json, sw.js, icons PWA
├── src/
│   ├── config/        # Configuration Supabase
│   ├── types/         # Types TypeScript
│   ├── services/      # Supabase, Location, Auth
│   ├── context/       # AuthContext, DemandeContext
│   ├── components/    # DepanneurCard, EtoilesWidget, TypePanneTile, LoadingWidget
│   └── screens/       # Tous les ecrans de l'application
```

### Installation
```bash
cd benin-secours-client
npm install
npm run dev     # localhost:5173 (accessible sur le reseau local)
```

### Deploiement PWA
```bash
npm run build   # Genere le dossier dist/ pret pour Vercel/Netlify
```

### Ecrans
1. **SplashScreen** - Ecran de lancement avec animation
2. **AccueilScreen** - Choix Moto / Vehicule
3. **SignalerPanneScreen** - GPS + type de panne + description
4. **ListeDepanneursScreen** - Resultats avec elargissement de rayon
5. **DetailDepanneurScreen** - Fiche + appel/WhatsApp/demande
6. **MesDemandesScreen** - Historique des demandes
7. **DetailDemandeScreen** - Suivi avec actions
8. **NotationScreen** - Evaluation a 3 criteres avec etoiles

### Test sur telephone
1. Connecter le telephone sur le meme WiFi que le PC
2. Ouvrir l'IP locale affichee par Vite dans Chrome mobile
3. Cliquer sur "Ajouter a l'ecran d'accueil" dans Chrome
4. L'application s'installe comme une application native avec acces GPS

## Regles Metier
- **Separation Moto/Vehicule** : Filtrage strict via get_prestataires_proches
- **Commission 10%** : Geree automatiquement par les triggers Supabase
- **Validation admin** : Les prestataires doivent etre valides avant d'apparaitre
- **GPS natif** : Utilisation de navigator.geolocation pour la position exacte
- **PWA installable** : Mode standalone, orientation portrait, icons adaptees

## Technologies
- Admin : Next.js 14, Tailwind CSS, Recharts, Lucide React, Supabase
- Client : React 18, Vite, Tailwind CSS, React Router, Supabase, PWA

## Auteur
Developpe pour le Benin - Assistance routiere geolocalisee
