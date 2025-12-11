# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versions and changelogs.

## Workflow Overview

There are **TWO PRs** in the release process:

1. **Your feature PR** (you create this) - contains your code changes + changeset file
2. **Version bump PR** (automatically created) - contains version bump and changelog updates

## Step-by-step process

### 1. Create your feature branch and make changes
```bash
git checkout -b feat/my-feature
# ... make your code changes ...
git add .
git commit -m "feat: add new feature"
```

### 2. Add a changeset (BEFORE creating PR)
```bash
npm run changeset
```

This will prompt you to:
1. Select the type of change (major, minor, or patch)
2. Write a summary of the changes

This creates a changeset file in `.changeset/` that describes your changes.

### 3. Commit the changeset file
```bash
git add .changeset/
git commit -m "feat: add changeset for my feature"
git push origin feat/my-feature
```

### 4. Create your PR (first PR - you create this)
- Create PR from `feat/my-feature` → `master`
- Include your code changes AND the changeset file
- After review and approval, merge this PR

### 5. Automatic version bump PR (second PR - created automatically)
After your PR is merged to `master`:
- The `changeset-version.yml` workflow automatically runs
- It detects the changeset file you added
- Creates a **new PR** with title `"chore: version packages"`
- This PR contains:
  - Updated `package.json` version (e.g., `1.0.4` → `1.0.5`)
  - Updated `CHANGELOG.md`
  - Updated changeset files

### 6. Merge version bump PR and publish
- Review and merge the `"chore: version packages"` PR
- After merge, the workflow automatically:
  - Builds the package (`npm run build`)
  - Publishes to npm (`npm publish`)
  - Creates a git tag with the new version

## Manual release (alternative)

If you want to release manually without the automatic PR:

```bash
npm run version  # Bump versions based on changesets
npm run release  # Publish to npm
```

## Changeset files

Changeset files are automatically generated and should be committed with your feature PR. They look like:

```
---
"@codee-sh/medusa-plugin-automations": patch
---

Description of your changes here
```

**Important:** Always commit changeset files with your feature PR. Without them, no version bump will happen!
