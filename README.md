# Corentin Barbedette - FIL 2025

Ce projet intervient dans le cadre de l'UE Web de la troisième année de formation FIL à IMT Atlantique.

## Installation

Le projet utilise bun pour gérer les dépendances et les scripts. Pour l'installer, exécutez la commande suivante :

```bash
npm install
```

## Serveur

Pour lancer l'application, rendez-vous sur `http://localhost:3000` à l'aide de la commande suivante :

```bash
npm run dev
```

## Application

L'application est une carte du monde interactive permettant de visualiser les pays et leurs informations. 
En termes, de technologies, elle utilise le meta-framework NuxtJs.

### Interactions
##### Survol
Lorsque vous survolez un pays, celui-ci est mis en surbrillance et son apparait.
##### Clique
Dans la partie haute de l'interface, un bouton de selection vous permet de choisir quelles informations vous souhaitez afficher parmis la monnaie, le nombre d'habitants ou la capitale du pays.
Une fois selectionée, vous pouvez cliquer sur un pays pour afficher les valeurs.
