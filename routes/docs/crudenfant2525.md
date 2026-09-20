# Integration API Canteen pour le front

Cette API sert au front pour lire et modifier les donnees de cantine en JSON.

## Base URL

Toutes les routes commencent par :

```text
/api/{current_team}
```

`current_team` est le slug de l'equipe courante.

Exemple :

```text
/api/cantine-test/children
```

## Authentification

Connexion :

```http
POST /api/login
```

Payload :

```json
{
  "pin": "1234",
  "remember": true
}
```

`pin` doit contenir exactement 4 chiffres.

Reponse :

```json
{
  "message": "Authenticated.",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  },
  "current_team": {
    "id": 1,
    "name": "Cantine Test",
    "slug": "cantine-test"
  },
  "teams": []
}
```

Les routes sont protegees par Laravel :

- utilisateur connecte
- email verifie
- membre de l'equipe dans l'URL

Pour un front Inertia dans le meme domaine, utiliser les cookies de session existants.

Avec `fetch`, ajouter :

```ts
credentials: 'same-origin'
```

Pour les requetes `POST`, `PUT`, `PATCH`, `DELETE`, envoyer aussi le token CSRF.

```ts
const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
```

## Helper fetch conseille

```ts
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

    const response = await fetch(url, {
        ...options,
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API error ${response.status}`);
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json() as Promise<T>;
}
```

## Enfants

Lister les enfants :

```http
GET /api/{current_team}/children
```

Filtres :

```text
?search=aya
?per_page=20
```

Creer un enfant :

```http
POST /api/{current_team}/children
```

```json
{
  "first_name": "Aya",
  "last_name": "Kouadio",
  "matricule": "CAN-001",
  "gender": "female",
  "birth_date": "2018-04-12",
  "class_name": "CE1",
  "parent_name": "Marie Kouadio",
  "parent_phone": "+225 07 01 02 03 04",
  "status": "active",
  "notes": "Allergie arachides."
}
```

Lire, modifier, supprimer :

```http
GET /api/{current_team}/children/{child}
PATCH /api/{current_team}/children/{child}
DELETE /api/{current_team}/children/{child}
```

## Paiements

Lister les paiements :

```http
GET /api/{current_team}/payments
```

Filtres :

```text
?child_id=1
?date=2026-05-31
?type=daily
?mode=cash
?per_page=20
```

Creer un paiement :

```http
POST /api/{current_team}/payments
```

```json
{
  "child_id": 1,
  "amount": 500,
  "payment_date": "2026-05-31",
  "payment_type": "daily",
  "payment_method": "cash",
  "period_label": "31 mai 2026",
  "reference": "PAY-001",
  "notes": null
}
```

Lire, modifier, supprimer :

```http
GET /api/{current_team}/payments/{payment}
PATCH /api/{current_team}/payments/{payment}
DELETE /api/{current_team}/payments/{payment}
```

Valeurs acceptees :

- `payment_type`: `daily`, `weekly`, `monthly`, `custom`
- `payment_method`: `cash`, `mobile_money`, `bank_transfer`, `other`

## Presences

Lister les presences :

```http
GET /api/{current_team}/attendances
```

Filtres :

```text
?date=2026-05-31
?per_page=20
```

Enregistrer les presences du jour :

```http
POST /api/{current_team}/attendances/daily
```

```json
{
  "attendance_date": "2026-05-31",
  "attendances": [
    {
      "child_id": 1,
      "is_present": true,
      "meal_served": true,
      "notes": null
    },
    {
      "child_id": 2,
      "is_present": false,
      "meal_served": false,
      "notes": "Absence signalee par le parent."
    }
  ]
}
```

Supprimer une presence :

```http
DELETE /api/{current_team}/attendances/{attendance}
```

## Exemple front rapide

```ts
const teamSlug = 'cantine-test';

const children = await apiRequest(`/api/${teamSlug}/children?per_page=20`);

await apiRequest(`/api/${teamSlug}/children`, {
    method: 'POST',
    body: JSON.stringify({
        first_name: 'Aya',
        last_name: 'Kouadio',
        matricule: 'CAN-001',
        status: 'active',
    }),
});
```

## Notes importantes pour l'IA front

- Toujours utiliser le slug equipe dans l'URL.
- Toujours envoyer `Accept: application/json`.
- Pour les mutations, envoyer `Content-Type: application/json`.
- Les listes paginees retournent la structure Laravel standard: `data`, `links`, `meta`.
- `DELETE` retourne `204 No Content`.
- Les erreurs de validation retournent `422` avec les erreurs Laravel.
