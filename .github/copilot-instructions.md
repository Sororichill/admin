# Copilot CLI Instructions — Sororichill Admin

## Project Overview

This is a single-page admin panel (`index.html`) for reviewing and approving/rejecting host requests submitted through the Sororichill app. It communicates with a Supabase Edge Function (`admin-review-host`) via a shared admin secret.

## Technology Stack

- **Frontend:** Vanilla HTML/CSS/JS (single `index.html` file, no build step)
- **Backend:** Supabase Edge Function (`admin-review-host`)
- **Auth:** Admin secret passed via `X-Admin-Secret` header

## Git Branching & Commit Workflow

### Branch-per-task

Every new task or feature **must** be done on a dedicated branch created from the latest `main`:

1. **Pull latest `main`** — `git checkout main && git pull`
2. **Create a feature branch** — Use conventional prefixes:
   - `feat/<short-description>` for new features
   - `fix/<short-description>` for bug fixes
   - `chore/<short-description>` for maintenance, refactors, config changes
3. **Commit freely on the branch** — Use concise, conventional-commit-style messages. No need to ask the developer for permission on each commit.
4. **When the task is complete** — Present a summary of all changes made and ask the developer to validate.
5. **Merge to `main`** — Only after the developer explicitly approves. Use `git checkout main && git merge <branch>` (fast-forward when possible).

### Rules

- **Never commit directly to `main`.** All work happens on feature branches.
- **Do not add a `Co-authored-by` line** to commit messages.
- Multiple agents can work simultaneously on separate branches without conflicts.
