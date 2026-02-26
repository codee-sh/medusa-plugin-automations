# Agent Skills (Cursor + Codex)

This directory contains project-level skills for AI coding agents.

## Structure

```
.ai/skills/
  docs/
    SKILL.md
```

## Linking to Cursor and Codex

Use a single source (`.ai/skills`) and symlink it for each tool:

```bash
mkdir -p .cursor .codex
ln -sfn ../.ai/skills .cursor/skills
ln -sfn ../.ai/skills .codex/skills
```
