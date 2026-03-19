# Sororichill Admin

Admin dashboard for reviewing organizer applications on the [Sororichill](https://github.com/Sororichill/sororichill) platform.

**Live:** [https://sororichill.github.io/admin/](https://sororichill.github.io/admin/)

## Overview

This is a single-page React app that lets admins review, approve, and reject organizer applications. It communicates with a Supabase Edge Function (`admin-review-organizer`) using a shared admin secret.

### Features

- **Three-tab view** — Pending, Approved, Rejected applications
- **Approve / Reject with reason** — modal-based actions with confirmation
- **Live counts** — stats bar shows application totals per status
- **Fade-out transitions** — smooth UI when an application changes status
- **Toast notifications** — success/error feedback

## Tech Stack

- React 19 + TypeScript
- Vite 8
- GitHub Pages (auto-deployed from `main`)

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm

### Install & Run

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/admin/`.

### Build

```bash
npm run build
npm run preview   # preview the production build locally
```

### Lint

```bash
npm run lint
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds and deploys to GitHub Pages automatically.

## Authentication

The admin panel authenticates via a shared secret sent as an `X-Admin-Secret` header to the Supabase Edge Function. The secret is set as a Supabase secret on the production project — it is **never** stored in this repo.

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Auth state, login/dashboard routing
├── config.ts             # Production API URL
├── api.ts                # API client (fetch wrappers)
├── types.ts              # TypeScript interfaces
└── components/
    ├── LoginPage.tsx      # Password input + validation
    ├── DashboardPage.tsx  # Tabs, stats, organizer list
    ├── OrganizerCard.tsx  # Individual application card
    ├── ApproveModal.tsx   # Approval confirmation dialog
    ├── RejectModal.tsx    # Rejection reason dialog
    └── Toast.tsx          # Toast notification system
```
