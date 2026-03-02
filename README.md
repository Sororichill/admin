# Sororichill Admin

Admin panel for reviewing and managing host applications submitted through the [Sororichill](https://github.com/) app.

## What it does

When a user applies to become a host on Sororichill, their request lands here for manual review. Admins can:

- **View** pending, approved, and rejected host applications
- **Approve** a host request (triggers Stripe account setup)
- **Reject** a host request

Each application displays the applicant's legal name, date of birth, phone, address, IBAN (masked), Stripe account ID, and optional description.

## How it works

The panel is a single `index.html` file — no build step, no framework. It authenticates via an admin secret and talks directly to a **Supabase Edge Function** (`admin-review-host`).

```
Browser  ──X-Admin-Secret──▶  Supabase Edge Function  ──▶  Database
```

### Auth flow

1. Admin enters the shared secret on the login screen.
2. The secret is sent as an `X-Admin-Secret` header on every request.
3. If the secret is invalid, the Edge Function returns an error and the admin is not logged in.

## Running locally

Just open `index.html` in a browser — it points to the remote Supabase Edge Function by default.

```sh
open index.html
```

To serve it locally (e.g. for live-reload):

```sh
npx serve .
```

## Project structure

```
sororichill-admin/
├── index.html    # The entire admin UI
└── README.md
```
