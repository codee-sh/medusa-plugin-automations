# AGENTS.md

Instructions for AI coding agents working on this repository.

## Project Overview

Medusa plugin for automations.
Provides rule-based triggers and actions
for notifications and custom workflows.

- Package: `@codee-sh/medusa-plugin-automations`
- Medusa: `>= 2.8.8`
- Node.js: `>= 20`
- Package manager: `yarn` (v3, see `.yarnrc.yml`)

## Scripts

```bash
yarn build              # build plugin (medusa plugin:build)
yarn dev                # develop plugin (medusa plugin:develop)
yarn prepublishOnly     # build before publish (medusa plugin:build)
yarn publish-local      # publish locally (npx medusa plugin:publish)
yarn publish-package    # publish to npm (dotenv npm publish --access public)
yarn format             # prettier write (src)
yarn format:check       # prettier check (src)
yarn changeset          # add changeset
yarn version            # version bump
yarn release            # publish via changesets
yarn release:manual     # build + npm publish
yarn prepare-release    # prep release branch
```

## Code Style

- Prettier: 60-char print width, no semicolons, double quotes, trailing commas (es5)
- Config: `.prettierrc`
- TypeScript: ES2021, Node16 modules, strict null checks, decorators enabled
- Config: `tsconfig.json`

## Branch Model

- `main` — release-ready, every commit is tagged and deployable
- `develop` — nightly builds and upcoming release work
- Topic branches: `feat/<name>`, `fix/<name>`, `chore/<name>`, `docs/<name>`
- PRs target `develop` by default
- Hotfixes branch from `main`, merge back to `main` and `develop`

## Versioning and Release

- Uses [Changesets](https://github.com/changesets/changesets) for version management
- Add changeset: `yarn changeset`
- Version bump: `yarn changeset version`
- Release: merge release branch to `main`, tag is created automatically
- CI: GitHub Actions for PR labeling and release-on-merge

## Architecture

### High-Level Flow

```
Event/Schedule/Manual trigger
  → Subscriber/Job
    → Rule evaluation
      → Action handlers
        → Medusa Notification Module (delivery)
```

### Source Tree

```
src/
├── admin/              # Admin panel UI
├── api/                # Admin API routes (/api/admin/mpn/...)
├── emails/             # Email helpers/templates
├── hooks/              # React hooks for API calls
├── jobs/               # Scheduled jobs
├── links/              # Module links
├── modules/
│   └── mpn-automation/ # Core module: models, services, migrations
├── providers/          # Notification providers (e.g. slack)
├── subscribers/        # Medusa event subscribers
├── utils/              # Helpers
└── workflows/          # Automation + domain workflows
```

### Key Modules

| Module | Path | Purpose |
|--------|------|---------|
| `mpn-automation` | `src/modules/mpn-automation/` | Core: DB models, services, migrations |
| Providers | `src/providers/` | Notification providers (e.g. Slack) |
| Workflows | `src/workflows/` | Automation + domain workflows |
| Subscribers | `src/subscribers/` | Event listeners for triggers |

## Documentation

- `README.md` — overview, install, basic setup
- `docs/configuration.md` — plugin options, actions, rules
- `docs/admin.md` — admin panel user guide
- `CONTRIBUTING.md` — branch model, PR rules, release process

## AI Skills

Project skills live in `skills/`.
If symlinked, use `.ai/skills/` with
`.cursor/skills` and `.codex/skills`.

| Skill | When to use |
|-------|-------------|
| `docs` | Writing or updating documentation |

## Rules for Agents

1. Always run `yarn format` before committing.
2. Follow the branch model: feature work from `develop`, PRs to `develop`.
3. Add a changeset (`yarn changeset`) for any user-facing change.
4. Use consistent terminology: `automation`, `trigger`,
   `rule`, `action`, `mpn-automation`, `workflow`.
5. When changing docs, follow the `docs` skill.
6. Do not commit `.env`, `node_modules`, `.medusa/`, or build artifacts.
