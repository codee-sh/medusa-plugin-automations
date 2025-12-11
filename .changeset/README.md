# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versions and changelogs.

## Adding a changeset

When you make changes that should be included in a release, run:

```bash
npm run changeset
```

This will prompt you to:
1. Select the type of change (major, minor, or patch)
2. Write a summary of the changes

This creates a changeset file in `.changeset/` that describes your changes.

## Release process

1. When changesets are merged to `master`, the `changeset-version.yml` workflow will:
   - Create a PR with version bumps and changelog updates
   - When that PR is merged, automatically publish to npm

2. Alternatively, you can manually run:
   ```bash
   npm run version  # Bump versions based on changesets
   npm run release  # Publish to npm
   ```

## Changeset files

Changeset files are automatically generated and should be committed with your PR. They look like:

```
---
"@codee-sh/medusa-plugin-automations": patch
---

Description of your changes here
```
