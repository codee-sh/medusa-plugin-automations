#!/usr/bin/env bash
set -euo pipefail

# Creates a GitHub PR from the current branch and generates a description.
# Requires: gh CLI authenticated.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required but not found in PATH." >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Error: gh CLI is not authenticated. Run 'gh auth login'." >&2
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ -z "$CURRENT_BRANCH" || "$CURRENT_BRANCH" == "HEAD" ]]; then
  echo "Error: unable to determine current branch." >&2
  exit 1
fi

BASE_BRANCH="${BASE_BRANCH:-develop}"
PR_TITLE="${PR_TITLE:-${CURRENT_BRANCH}}"

changeset_summaries=()
if [[ -d .changeset ]]; then
  while IFS= read -r -d '' file; do
    # Extract first non-empty paragraph after the second ---
    summary=$(awk '
      BEGIN { sep=0; out="" }
      /^---$/ { sep++; next }
      sep>=2 {
        if (out=="" && $0 ~ /\S/) { out=$0; next }
        if (out!="" && $0 ~ /^\s*$/) { exit }
        if (out!="" ) { out=out" " $0 }
      }
      END { print out }
    ' "$file")
    if [[ -n "$summary" ]]; then
      changeset_summaries+=("$summary")
    fi
  done < <(git diff --name-only "$BASE_BRANCH"...HEAD -- .changeset \
    | grep -E '\.md$' \
    | tr '\n' '\0')
fi

BODY_FILE="${BODY_FILE:-/tmp/pr-body-$$.md}"
{
  echo "## Summary"
  if [[ ${#changeset_summaries[@]} -gt 0 ]]; then
    for s in "${changeset_summaries[@]}"; do
      echo "- $s"
    done
  else
    echo "- Describe the changes in this PR."
  fi
  echo
  echo "## Testing"
  echo "- Not run (not requested)."
} > "$BODY_FILE"

# Create PR
if gh pr create \
  --base "$BASE_BRANCH" \
  --head "$CURRENT_BRANCH" \
  --title "$PR_TITLE" \
  --body-file "$BODY_FILE"; then
  echo "PR created successfully."
else
  echo "Failed to create PR." >&2
  exit 1
fi

rm -f "$BODY_FILE"
