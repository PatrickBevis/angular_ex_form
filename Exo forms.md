# Exercice

---

## 🧩 Exercice Angular : Formulaire d’inscription avec Reactive Forms et communication entre composants

### 🎯 Objectif

Créer une application Angular composée de **deux composants** permettant de gérer un formulaire d’inscription.

L’objectif est de pratiquer :

- les **Reactive Forms**
- la communication **parent → enfant avec `@Input()`**
- la communication **enfant → parent avec `@Output()`**

---

## 📋 Contexte

Vous devez créer une petite application permettant d’enregistrer un utilisateur via un formulaire.

L’application contiendra :

- un **composant parent** : `register-page`
- un **composant enfant** : `user-form`

Le composant enfant contiendra le **Reactive Form** et le composant parent affichera les données envoyées.

---

# Partie 1 — Création du formulaire (Reactive Forms)

Dans le composant `user-form`, créer un **Reactive Form** contenant les champs suivants :

- **name** (obligatoire, minimum 3 caractères)
- **email** (obligatoire, format email)
- **age** (obligatoire, minimum 18)

Ajouter un **bouton Submit** qui envoie les données du formulaire.

Contraintes :

- Le bouton doit être **désactivé si le formulaire est invalide**
- Les **messages d’erreur** doivent apparaître sous chaque champ

---

# Partie 2 — Communication Enfant → Parent (`@Output`)

Quand l’utilisateur soumet le formulaire :

1. Le composant `user-form` doit **émettre un événement**
2. Cet événement doit envoyer **les données du formulaire au parent**

Utiliser :

```tsx

userCreated = output();
```

---

# Partie 3 — Affichage dans le parent

Dans `register-page` :

- récupérer les données envoyées
- Créer un **composant `user-card`** qui affiche les informations de l’utilisateur
- Passer les données via **@Input()** à ce composant

Exemple d’affichage :

```
Utilisateur enregistré :
Nom : Alice
Email : alice@email.com
Age : 25
```

---

## Bonus

 Ajouter un bouton **"Supprimer l'utilisateur"** qui émet un **@Output()**