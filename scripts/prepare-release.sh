#!/bin/bash

# Script to prepare release on develop and create release branch
# Usage: ./scripts/prepare-release.sh

set -euo pipefail

echo "🚀 Starting release preparation..."

# Step 1: Prepare release on develop
echo ""
echo "📦 Step 1: Preparing release on develop..."
git checkout develop
git pull origin develop

echo "Running changeset version..."
yarn changeset version

# Check if there are changes
if git diff --quiet && git diff --cached --quiet; then
  echo "⚠️  No changes detected after 'yarn changeset version'"
  echo "   This might mean there are no changesets to process."
  exit 1
fi

echo "Staging changes..."
git add .

echo "Committing version bump..."
git commit -m "chore: version packages"

echo "Pushing to develop..."
git push origin develop

# Step 2: Create release branch
echo ""
echo "🌿 Step 2: Creating release branch..."

# Extract version from package.json
VERSION=$(node -p "require('./package.json').version")
RELEASE_BRANCH="release/v${VERSION}"

echo "Detected version: ${VERSION}"
echo "Creating branch: ${RELEASE_BRANCH}"

git checkout -b "${RELEASE_BRANCH}"
git push origin "${RELEASE_BRANCH}"

echo ""
echo "✅ Release preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to GitHub and create PR: ${RELEASE_BRANCH} → main"
echo "2. Title: release: v${VERSION}"
echo "3. Description: Copy relevant section from CHANGELOG.md"
echo "4. Merge PR to main"
echo ""
echo "✨ After merge, workflow will automatically:"
echo "   - Create tag v${VERSION}"
echo "   - Publish to npm"
echo "   - Create GitHub Release"
