@AGENTS.md

## Checkpoint workflow

After every meaningful clean implementation checkpoint, run the repository verification suite (`npm run build`, `npm run lint`, `npx tsc --noEmit`), commit the verified changes with a descriptive conventional commit, and push the active development branch (`claude-dev`) to GitHub. Promote to `main` only at stable deployment milestones. Full detail: `docs/DEPLOYMENT_WORKFLOW.md`.
