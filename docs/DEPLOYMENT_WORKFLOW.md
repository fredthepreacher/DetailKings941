# Deployment & Checkpoint Workflow

How this repository is developed, checkpointed, and promoted to production.

## Branches

- **`main`** — stable, production-ready, known-good checkpoints only. If Vercel is connected to this repo, pushes to `main` trigger a production deployment.
- **`claude-dev`** — active development branch. Day-to-day implementation work happens here.

## Checkpoint protocol

Every meaningful, clean implementation checkpoint follows this sequence:

1. **Verify** — run the project's verification suite:
   ```bash
   npm run build
   npm run lint
   npx tsc --noEmit
   ```
   (No test suite exists yet — add `npm test` to this list once one is added.) Also do relevant visual/runtime QA for any change that touches UI.
2. **Inspect** — `git status` and `git diff --stat` before staging, to confirm nothing unintended is being committed (`.env*`, credentials, `node_modules`, `.next`, temporary asset archives — all already covered by `.gitignore`).
3. **Commit** — only after verification passes, with a conventional commit message (`feat(...)`, `fix(...)`, `chore(...)`), never a vague message like "update" or "changes".
4. **Push** — push `claude-dev` to the configured GitHub remote.

## Commit convention

```
feat(brand): integrate official Detail Kings identity
feat(media): integrate client photography and gallery
feat(transformations): add verified before-after portfolio
feat(quote): finalize detailing quote experience
fix(responsive): polish mobile media layouts
feat(seo): finalize local SEO and structured data
chore(checkpoint): Phase N milestone description
```

## Milestone tags

Stable milestones get an annotated tag, pushed to GitHub:

```
detail-kings-v0.1-phase1
detail-kings-v0.2-brand
detail-kings-v0.3-media
detail-kings-v0.9-prelaunch
detail-kings-v1.0-launch
```

Only tag genuinely stable, verified states.

## Promotion to `main`

At approved milestone boundaries (Phase 1 Foundation, Phase 2 Brand Integration, Phase 2 Media Integration, Pre-Launch, Production Launch): run the full verification suite on `claude-dev`, and if clean, merge/fast-forward `main` to that commit and push it. Never push a failing or incomplete state to `main`. Never force-push or rewrite history without the client explicitly authorizing it and a documented reason.

## CI

`.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npx tsc --noEmit`, and `npm run build` on every push to `main` and every pull request targeting `main`, so a broken build is visible before it reaches production.
