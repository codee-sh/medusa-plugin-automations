# Contributing

Thank you for your interest in contributing to this project! This document describes the workflow for working on the repository and the conventions we should follow. If you have any questions, we encourage you to reach out via issues or directly with the team.

## Important Information

- All changes should be made through Pull Requests (PR)
- Before starting work on larger changes, consult with the team
- All PRs should include appropriate tests
- Code should follow the accepted style conventions
- **The project uses Changesets** for version management - every PR with code changes requires a changeset

## Prerequisites

- Knowledge of Git and GitHub (Issues, Pull Requests)
- Local development environment configured
- Node.js >= 20
- Yarn 3.2.3+
- Knowledge of technologies used in the project (Medusa, TypeScript, React)

## Workflow

### 1. Issues before PR

1. **Check existing issues** - before starting work, make sure there isn't already an issue for what you want to work on
2. **Create an issue** - if there's no appropriate issue, create a new one, describing:
   - What you want to implement/change
   - Why this change is needed
   - What are the expected results
3. **Wait for approval** - for larger changes, wait for team approval before starting work

### 2. Branches

All changes should be made in separate branches and submitted as Pull Requests.

**Branch naming:**
- `fix/` - for bug fixes (e.g., `fix/login-error`)
- `feat/` - for new features (e.g., `feat/user-profile`)
- `docs/` - for documentation changes (e.g., `docs/api-update`)
- `refactor/` - for code refactoring (e.g., `refactor/auth-module`)
- `test/` - for adding or improving tests (e.g., `test/integration-tests`)
- `chore/` - for maintenance tasks (e.g., `chore/dependencies-update`)

**Base branch:**
- Use `develop` as the base branch for your PRs by default
- `master` is only used by admins for releases

### 3. Commits

- Try to create small, isolated commits - this makes review and understanding changes easier
- Use conventional commit messages:
  - `fix: fixed login error`
  - `feat: added password reset functionality`
  - `docs: updated API documentation`
  - `refactor: improved authorization module structure`
  - `test: added unit tests for payment module`
  - `chore: updated dependencies`

### 4. Pull Requests

**Process (for developers):**
1. Make sure your branch is up to date with `develop`
2. **Add a changeset** (if you're making code changes) - see the [Changesets](#changesets) section
3. Create a Pull Request with a clear description of changes **to the `develop` branch**
4. Add appropriate labels and assign reviewers
5. Respond to comments and make corrections
6. After approval, the PR will be merged into `develop`

**Release process (admins only):**

1. After merging changes to `develop`, admin creates a PR from `develop` to `master`
2. This PR contains all changes ready for release
3. After merging to `master`, admin performs release locally (see the [Release Process](#release-process-locally-by-admin) section)

**How to create a PR from `develop` to `master`:**

1. **Make sure `develop` is up to date:**
```bash
git checkout develop
git pull origin develop
```

2. **Create PR on GitHub:**
   - Base branch: `master`
   - Compare branch: `develop`
   - PR title: `chore: release [date]` or `chore: prepare release` (e.g., `chore: release 2024-01-15`)

3. **In the PR description you can:**
   - List the main changes in this release
   - Add links to merged PRs from `develop`
   - Optionally: add a list of changesets that will be processed

4. **After creating the PR:**
   - Merge the PR to `master` (squash merge or merge commit)
   - After merge, perform the release process locally (see the [Release Process](#release-process-locally-by-admin) section)

**PR description structure:**
- **What** - what was changed in this PR
- **Why** - why these changes are needed
- **How** - how the changes were implemented
- **Testing** - how the changes were tested or how the reviewer can test them
- **Related issue** - link to the related issue (use keywords: `closes #123`, `fixes #456`)

**Self-review:**
We encourage self-review of code before requesting review. Check:
- Is the code readable and follows conventions
- Do all tests pass
- Are there no unused imports or comments
- Has documentation been updated (if applicable)
- Has a changeset been added (if applicable)

**Merge Style:**
- Pull Requests are merged via squash and merge
- Make sure the commit message is clear and descriptive

## Local Development

### Environment Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Install dependencies:**
```bash
yarn install
```

3. **Start the development server:**
```bash
yarn dev
```

This will start the plugin in watch mode, automatically rebuilding on changes.

### Project Structure

```
medusa-plugin-automations/
├── src/
│   ├── admin/              # Admin UI (React components)
│   ├── api/                # API routes (admin/store)
│   ├── modules/           # Medusa modules
│   ├── workflows/          # Medusa workflows
│   ├── subscribers/        # Event subscribers
│   ├── providers/          # Action providers (Slack, etc.)
│   └── utils/             # Utility functions
├── docs/                   # Documentation
├── .changeset/             # Changesets for versioning
├── .github/                # GitHub workflows
└── package.json
```

### Working with the plugin locally (yalc)

If you're working on the plugin and want to test it in a Medusa application:

1. **In the plugin directory, build and publish locally:**
```bash
yarn build
yalc publish
```

2. **In the Medusa application, link the local plugin:**
```bash
cd /path/to/medusa-app
yalc link @codee-sh/medusa-plugin-automations
yarn install
```

3. **While working on the plugin:**
```bash
# In the plugin directory (watch mode)
yarn dev

# In the Medusa application (in a separate terminal)
yarn dev
```

4. **After finishing work, remove local links:**
```bash
cd /path/to/medusa-app
yalc remove @codee-sh/medusa-plugin-automations
yarn install
```

**Note:** `.yalc` and `yalc.lock` files are ignored by git - don't commit them.

## Testing

### Types of Tests

- **Unit tests** - unit tests for individual functions/modules
- **Integration tests** - integration tests for larger components
- **E2E tests** - end-to-end tests for entire flows

### Running Tests

```bash
# All tests
yarn test

# Tests in watch mode
yarn test:watch

# Tests with coverage
yarn test:coverage

# Integration tests
yarn test:integration
```

### Test Requirements

- All PRs should include appropriate tests for the changes made
- New features require new tests
- Bug fixes should include tests that reproduce and verify the fix
- Aim for code coverage >= 80%

## Documentation

### Updating Documentation

- If you change user-facing API, update documentation in `docs/`
- Add usage examples for new features
- Update README.md if you change the setup or installation process
- Document breaking changes through changesets (CHANGELOG.md is generated automatically)

### Documentation Conventions

- Use [TSDoc](https://tsdoc.org/) for TypeScript documentation
- Use JSDoc for JavaScript documentation
- Write documentation in English (or according to project convention)
- Add code examples where possible

## Code Style

### Formatting

- We use Prettier for code formatting
- Run `yarn format` before committing (formats files)
- Check formatting before PR: `yarn format:check` (checks without formatting)

### Linting

- All files should pass linting without errors
- Run `yarn format:check` before committing (checks formatting)
- Fix all warnings before PR

### TypeScript

- Use TypeScript for all new files
- Avoid `any` - use appropriate types
- Add types for all public APIs
- Use interfaces for objects, type for union types
- Export types from `src/utils/types/` for public API

## Changesets

The project uses [Changesets](https://github.com/changesets/changesets) for version and changelog management.

### Changesets Workflow

The release process consists of **three stages**:

1. **Feature PR** (you create) - contains code changes + changeset file → merge to `develop`
2. **Release PR** (admin creates) - PR from `develop` to `master` with ready changes
3. **Manual release** (admin executes locally) - after merge to `master`, admin locally runs `yarn version` and `yarn release`

**Flow diagram:**
```
Developer:
  feature-branch → PR → develop (with changeset)
  
Admin:
  develop → PR "chore: release [date]" → master
  
Admin (locally, after merge to master):
  1. git checkout master && git pull
  2. yarn version  (updates version and CHANGELOG)
  3. git commit && git push
  4. yarn release   (builds and publishes to npm)
```

### How to Add a Changeset

1. **After making code changes, before creating PR:**
```bash
yarn changeset
```

2. **Select the type of change:**
   - `major` - breaking changes
   - `minor` - new features (backward compatible)
   - `patch` - bug fixes (backward compatible)

3. **Describe the changes** - write a brief description of what was changed

4. **Commit the changeset file:**
```bash
git add .changeset/
git commit -m "feat: add changeset for my feature"
```

5. **Create PR to `develop`** - make sure the changeset file is included in the PR

### Release Process (locally by admin)

After merging PR from `develop` to `master`:

```bash
# 1. Switch to master and pull changes
git checkout master && git pull origin master

# 2. Update version and CHANGELOG
yarn version

# 3. Commit and push changes
git add package.json CHANGELOG.md .changeset/
git commit -m "chore: version packages"
git push origin master

# 4. Build and publish to npm
yarn release

# 5. Push tag
git push origin --tags
```

**Important:** 
- Changesets must be in PR to `develop` - without them `yarn version` won't find changes
- Make sure you're logged in to npm (`npm login`) before `yarn release`

### Changesets Commands

#### `yarn changeset`

**What it does:** Creates a new changeset file describing code changes.

**When to use:**
- After making code changes, **before creating PR**
- For every code change that should be included in the release
- **Don't use** for documentation-only changes (unless it's a breaking change in documentation)

**How to use:**
```bash
yarn changeset
```

**Process:** Select the type of change (major/minor/patch) and describe the changes. A file will be created in `.changeset/`.

---

#### `yarn version`

**What it does:** 
- Reads all changesets in `.changeset/`
- Updates version in `package.json` according to changeset types
- Updates `CHANGELOG.md` with change descriptions
- Removes processed changeset files

**When to use:**
- **Admins only** after merging PR `develop` → `master`, on `master` branch
- Before `yarn release`

**How to use:**
```bash
yarn version
```

**Process:** Checks changesets, updates version in `package.json` and `CHANGELOG.md`, removes processed changeset files.

**After running:** Commit the changes (`package.json`, `CHANGELOG.md`, `.changeset/`).

---

#### `yarn release`

**What it does:**
- Builds the package (`yarn build`)
- Publishes the package to npm (`npm publish`)
- Creates a git tag with the version

**When to use:**
- **Admins only** after `yarn version` and committing changes
- On `master` branch with updated version

**How to use:**
```bash
yarn release
```

**Process:** Builds the package (`yarn build`), publishes to npm (`yarn publish-package`), creates a git tag.

**Requirements:** Log in to npm (`npm login`), changes must be committed and pushed.

---

**Versioning:** The project uses [Semantic Versioning](https://semver.org/):
- `major` - breaking changes
- `minor` - new features (backward compatible)
- `patch` - bug fixes (backward compatible)

CHANGELOG.md is automatically generated by Changesets.

## Code Review

### For PR Authors

- Be open to feedback
- Respond to all comments
- Make corrections according to suggestions
- If you disagree with a suggestion, explain why

### For Reviewers

- Be constructive and polite
- Explain your suggestions
- Check not only code, but also tests and documentation
- Check if a changeset has been added (if applicable)
- Approve PR only if you're sure it's ready

## Questions and Help

- **Issues** - for bugs and feature requests
- **Discussions** - for questions and discussions
- **Team** - direct contact with team members

## License

By contributing to this project, you agree that your changes will be licensed under the same terms as the project.

---

Thank you for your contribution! 🎉
