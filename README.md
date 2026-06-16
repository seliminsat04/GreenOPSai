# 🍃 Opalia Recordati — GreenOps & Registre Énergétique Connecté
> **Plateforme d'Efficacité Énergétique, d'Analytique de Process et d'Audit Trail Réglementaire GAMP 5 / FDA 21 CFR Part 11.**

Cette application full-stack industrielle est conçue sur mesure pour l'infrastructure d'**Opalia Recordati (Ariana, Tunisie)**. Elle permet la collecte, le suivi, la simulation thermodynamique et l'audit conformiste des consommations d'énergie de l'usine pharmaceutique.

---

## 📌 Aperçu de la Plateforme

La console **GreenOps Opalia** unifie l'acquisition de données d'usine locales et leur validation réglementaire globale. Grâce à son raccordement bidirectionnel à la suite **Google Workspace**, l'armoire de contrôle numérique garantit une traçabilité sans faille (*ALCOA+*) des index de compteurs physiques.

```
                  ┌─────────────────────────────────────┐
                  │      OPALIA GREENOPS INTERFACE      │
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  DASHBOARD KPI  │         │ SIMULATEUR TND  │         │ FDA AUDIT TRAIL │
│ Suivi d'Index   │         │ Arrêts Thermic  │         │ Logs SHA-256    │
└────────┬────────┘         └─────────────────┘         └────────┬────────┘
         │                                                       │
         ▼                                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│           PASSERELLE GOOGLE CLOUD & WORKSPACE APIS              │
└────────┬───────────────────────────┬───────────────────────────┘
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  GOOGLE SHEETS  │         │    GMAIL API    │
│  Compteurs (ID) │         │ Rapports HTML   │
└─────────────────┘         └─────────────────┘
```

---

## 🌟 Fonctionnalités Clés

### 1. Dashboard Opérationnel (Efficacité Énergétique)
* **Indicateurs Multimodaux :** Monitoring en temps réel de l'**Électricité (kWh)**, de l'**Eau de boucle (m³)** et du **Gasoil de chaudière (Litres)**.
* **Intégration de l'Énergie Solaire :** Suivi qualitatif de l'impact photovoltaïque avec affichage du taux d'auto-consommation, des économies générées en TND, de l'empreinte carbone évitée, et la comparaison graphique de la part Solaire vs Réseau STEG.
* **Audit de Capacité & Détection d'Anomalies :** Analyse en temps réel du Taux de Charge par rapport au Calibre Maximum (Max A) des équipements. Le système alerte sur des machines de haute capacité non exploitées (consommation nulle) ou détecte les ratios de charge anormalement élevés pour une capacité restreinte.
* **Diagnostics Prédictifs :** Analyse proactive automatique ciblant les dérives thermiques (ex : déviation sur la Ligne Pommade ou de Conditionnement) pour orienter la maintenance préventive.
* **Aide Interactive :** Intégration d'un assistant IA intelligent (moteur de discussion de process) pour interroger les profils de consommation historiques d'Opalia Ariana.

### 2. Simulateur d'Arrêts Thermiques & d'Optimisation
* **Ajustement Climatique :** Intégration de coefficients d'influence thermique par rapport à la température extérieure à Ariana.
* **Calculateur Financier :** Estimation immédiate des économies d'exploitation (TND) et des réductions de l'empreinte carbone ($tCO_2$).
* **Planification HVAC :** Évaluation fine de l'impact des arrêts ou réductions de nuit (Setback d'armoires ISO).

### 3. Saisie Industrielle & Registre GAMP 5 / FDA 21 CFR Part 11
* **Contrôle d'Intégrité :** Chaque modification apportée aux 15 compteurs d'usine génère un enregistrement immutable d'Audit Trail local.
* **Sécurisation Cryptographique :** Signature automatique des transactions via génération d'empreintes **SHA-256** indélébiles (Scellement d'intégrité ALCOA+), scellant la valeur précédente, la nouvelle, l'acteur SSO et l'horodatage précis à la seconde locale de Tunis.

### 4. Interactions Google Workspace Avancées
* **Synchronisation Google Sheets bidirectionnelle :**
  - **Export Réel :** Conversion et téléversement structuré des 15 compteurs d'usine en un clic dans la feuille distante configurée via l'identifiant de classeur.
  - **Import Réel :** Restructuration locale instantanée des index Opalia par lecture directe depuis le classeur Cloud.
  - **Export FDA Trail :** Envoi exhaustif du journal réglementaire intègre d'audit technique (l'arborescence des actions d'usine) sur l'onglet `Audit_Trail`.
* **Diffusion Gmail API Certifiée :**
  - Génération de rapports graphiques HTML hautement stylisés, incluant des tableaux de bord énergétiques, le journal d'Audit Trail FDA conforme, ou les KPI de déviation d'armoire.
  - Expédition immédiate par e-mail en exploitant le compte professionnel Google Workspace connecté via l'authentification SSO.
* **Gestion des Agendas Google Calendar :**
  - Sélection de l'agenda de destination cible (ex: Agenda principal Energy Manager vs Agendas partagés de maintenance).
  - Planification centralisée des opérations d'audit, de sécurité ou de relevé curatif directement injectées dans le planning de l'usine, avec suivi des statuts de création.

### 5. Modes d'Autonomie GAMP 5 / FDA 21 CFR Part 11
L'application propose une gestion fine des droits de validation conforme aux normes pharmaceutiques, avec des modes mutuellement exclusifs pour la modification de l'état système ou les actions impactantes (modification compteurs, envoi d'emails, création d'événements) :
* **Approbation Humaine Stricte :** Oblige l'Energy Manager ou l'opérateur à valider explicitement (via popup bloquante) chaque proposition mutative suggérée par l'IA ou décidée par l'utilisateur (Ex: confirmation de l'inscription à l'agenda).
* **Autonomie Partielle - Mode Signature FDA :** Laisse exécuter la mutation de manière plus fluide mais exige une **signature numérique explicite** de l'opérateur (saisie de son nom/identifiant) pour entériner l'action dans le journal d'Audit Trail, garantissant l'imputabilité de chaque acte.

### 6. Assistant AI GreenOps avec Fonction Calling
* Interaction en langage naturel pour la consultation des états de l'armoire, météo, compteurs, et lancement scripté ou automatisé des actions Workspace (Génération d'emails, lecture/écriture Sheets, planification d'événements Calendar). L'IA agit en tant que collaborateur direct et ses actions de mutation sont filtrées par le proxy de blocage FDA selon le mode de validation actif.

### 7. Code Splitting de Haute Performance
* Pour s'adapter aux contraintes réseau de l'infrastructure d'Opalia à Ariana, l'application utilise du **Code Splitting par Route** sur les onglets principaux. Les modules lourds (`DashboardTab`, `SimulatorTab`, `RelevesTab`, `CostsTab`, `ChatTab`, `SettingsTab`) sont chargés dynamiquement à la volée grâce à React `lazy()` et encapsulés dans un composant `Suspense` fluide, réduisant drastiquement le temps de chargement initial.

### 8. Paramétrage Dynamique et Configurable
* Personnalisation centralisée de l'application via un onglet Paramètres.
* **Configurations Multi-fluides :** Ajustement en temps réel des tarifs unitaires (TND) et facteurs d'émission ($CO_2$) de l'Électricité, de l'Eau et du Gaz.
* **Intégration et Estimation Solaire :** Possibilité de configurer une estimation de production photovoltaïque mensuelle (kWh/mois) pour piloter précisément le calcul des taux d'autoconsommation de l'application sans nécessiter une sonde solaire matérielle.

---

## 🛠️ Architecture Technique

La plateforme utilise une architecture robuste, full-stack et découplée :

### 💻 Frontend (SPA Moderne)
- **Framework :** React 18 (TypeScript)
- **Remplacement Typage :** Typage stricte des entités (`Cabinet`, `UtilityTariffs`, `AuditLog`) défini centralement dans `/src/types.ts`.
- **Styles :** Tailwind CSS pour une interface épurée, minimaliste et adaptée à un usage sur tablettes durcies d'atelier.
- **Micro-Animations :** Transition fluide de l'arborescence via `motion` (importé depuis `motion/react`).
- **Performance :** Code-splitting par isolation dynamique des bundles de composants au niveau d'[`App.tsx`].

### ⚙️ Backend (Proxy Sécurisé Google API)
- **Framework :** Express Server + Vite Integration.
- **Sécurité et Masquage :** Isolation complète des jetons SSO. Toutes les interactions sensibles vers `https://sheets.googleapis.com` et `https://gmail.googleapis.com` transitent par des **proxies API serveurs** étanches (`/api/sheets/*`, `/api/gmail/*`), éliminant l'exposition des clés d'autorisation au navigateur.
- **Compilateur de Release :** Configuration de build automatisée réunissant le compilateur Vite et l'utilitaire **esbuild** pour exporter le backend TypeScript en un unique bloc CommonJS (`dist/server.cjs`), simplifiant grandement le déploiement sur les serveurs locaux d'Opalia Ariana.

---

## 🚀 Guide d'Installation Rapide

### Prérequis
- **Node.js** (v18 ou supérieur préconisé)
- Un projet **Firebase** provisionné (base Firestore et Authentification Google activées).
- Des identifiants **Google Client ID & Secret** configurés dans la console Workspace pour autoriser l'accès aux scopes suivants :
  - `https://www.googleapis.com/auth/spreadsheets`
  - `https://www.googleapis.com/auth/drive.file`
  - `https://www.googleapis.com/auth/gmail.send`

### 1. Variables d'Environnement
Créez un fichier `.env` à la racine de votre répertoire de travail inspiré de `.env.example` :
```env
# Clé secrète de communication (si requise par des moteurs externes)
GEMINI_API_KEY=votre_cle_gemini_si_applicable
```

Assurez-vous également que la configuration Firebase correspondante est bien renseignée à la racine dans le fichier `firebase-applet-config.json`.

### 2. Procédure de Lancement local

Installez l'ensemble des dépendances d'exploitation industrielles :
```bash
npm install
```

Démarrez le serveur d'intégration à la fois pour le backend Express et l'interface temps réel (Vite) :
```bash
npm run dev
```
*Le serveur démarrera automatiquement sur le port de communication conteneurisé exclusif **`http://localhost:3000`**.*

### 3. Compilation pour la Mise en Production
Préparez les bundles optimisés pour l'exécution d'usine :
```bash
npm run build
```

Lancez l'instance prête pour la production locale d'Opalia :
```bash
npm start
```

---

## 🔒 Charte de Validation GAMP 5 & ALCOA+
Dans le cadre de la conformité aux directives de l'industrie pharmaceutique Européenne et de la FDA américaine, ce système remplace les relevés manuels sur papier par un registre électronique certifié :
1. **Attributable (A) :** Chaque signature de modification est liée de façon unique à l'adresse e-mail de l'opérateur SSO.
2. **Legible (L) :** Le journal d'audit est lisible en clair sous forme de tableau, avec option d'archivage automatique vers Google Sheets.
3. **Contemporaneous (C) :** L'enregistrement de l'index se fait avec l'heure exacte fournie par le serveur central de Tunis.
4. **Original (O) :** Toute saisie remplace ou stocke l'état d'usine validé à la source physique sans déviation.
5. **Accurate (A) :** Des barrières logiques empêchent d'entrer des index finaux inférieurs aux index de départ d'armoires.

---

*Développé avec excellence pour l'ingénierie énergétique d'Opalia Recordati S.A., Ariana.*
