#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p "$ROOT_DIR/.cursor" "$ROOT_DIR/.codex"

ln -sfn ../.ai/skills "$ROOT_DIR/.cursor/skills"
ln -sfn ../.ai/skills "$ROOT_DIR/.codex/skills"

echo "Linked:"
echo " - .cursor/skills -> .ai/skills"
echo " - .codex/skills  -> .ai/skills"
