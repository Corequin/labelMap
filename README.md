# Corentin Barbedette - FIL 2025

Ce projet intervient dans le cadre de l'UE Web de la troisième année de formation FIL à IMT Atlantique.

## Installation

Le projet utilise bun pour gérer les dépendances et les scripts. Pour l'installer, exécutez la commande suivante :

```bash
bun install
```

## Lancement des instances

- Pour lancer le websocket, ouvrez un terminal à la racine du projet et effectuez les commandes suivantes :

```bash
cd server
bun run server
```

**Le Websocket est lancé sur le port 4000 : `http://localhost:4000`**

- Pour lancer l'application, ouvrez un autre terminal à la racine du projet et effectuez la commande suivante :

```bash
bun run dev
```

**L'application est lancée sur le port 3000 : `http://localhost:3000`**


## Application

L'application est une **carte du monde interactive** permettant à chaque utilisateurs de mettre des pays en **"favoris"**. 
En termes, de technologies, elle utilise le meta-framework **NuxtJs**.

## Collaboration
#### Utilisateurs
L'application, associée à un websocket permet d'inter-connecter de multiples utilisateurs (maximum 10). Chaque utilisateurs peux ainsi voir _**qui est connecté**_ à l'aide d'une liste de pseudo située en bas à gauche de l'écran. De plus, il est possible de voir le curseur des autres utilisateurs se **_déplacer en temps réels_** de manière à savoir **_où ils sont situés_** sur l'application. 
#### Messagerie
Lorsque vous cliqué sur le pseudo d'un utilisateur connecté, une boite de messagerie apparait en bas à droite de l'écran. Cette dernière permet d'**_envoyer des messages à l'utilisateur_** en question ainsi que d'en recevoir. De plus, il est possible de voir les pays que l'autre utilisateur à ajouté en favoris ainsi que les **_pays favoris en communs_**.

## Interactions
#### Simple Clique
Lorsque que vous effectuez un simple clique sur un pays, son nom ainsi qu'un bouton "favoris" apparaissent. Si vous décidez d'ajouter ce pays en tant que favoris, il apparaitra en **_surbrillance_**.
#### Double Clique
Lorsque que vous effectuez un double clique sur un pays, le pays sera **_automatiquement ajouté en tant que favoris_**, permettant ainsi un gain de temps.
#### Clique Droit
Lorsque que vous effectuez un clique sur la page, **_une barre d'outils_** apparaît. Elle permet soit de supprimer tous les pays favoris en cliquant sur l'icone _poubelle_, soit de changer la couleur de surbrillance des pays favoris en effectuant un **_drag-and-drop vers la carte_**, depuis une des case colorées. Un icone _déplacer_ permet de déplacer la barre d'outils et une icône _fermer_ permet de la faire disparaitre.


