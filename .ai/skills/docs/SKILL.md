---
name: plugin-docs-authoring
description: Rules for writing and updating plugin documentation. Use when creating new docs pages, updating existing docs (README, docs/*.md), or reviewing documentation changes.
---

## Prerequisites

Read `AGENTS.md` first for terminology, architecture, and template types.
This skill only covers documentation-specific rules.

## File Responsibilities

Each file has a strict scope. Do not mix responsibilities between files.

| File | Scope | Tone |
|------|-------|------|
| `README.md` | High-level overview, install, basic setup, links to docs | Short, navigational |
| `docs/configuration.md` | Plugin options only | Technical, example-driven |
| `docs/admin.md` | Admin panel user guide — what you can do, typical workflow | User-facing, no endpoints |

## Writing Rules

### Structure

1. Start every page with a one-sentence summary of what the page covers.
2. Use `##` for main sections, `###` for subsections. Do not go deeper than `####`.
3. Put "what the user can do" before technical details.
4. End pages with a `## See Also` section linking to related docs.

### Style

1. Write in English.
2. Use short sentences and short paragraphs.
3. Prefer bullet lists over long prose.
4. Use code blocks for every example — never inline large snippets.
5. Do not use emojis.

### Cross-referencing

1. Do not duplicate content between files — link to the authoritative page.
2. If you remove a page, update all references across docs and README.
3. Keep all internal links relative (`./blocks.md`, `../blocks.md`).

## Checklist (run before finishing)

- [ ] Does the content match the current architecture?
- [ ] Is `docs/admin.md` still non-technical (no raw endpoints)?
- [ ] Is `README.md` still short and navigational?
- [ ] Are there any dead links?
- [ ] Is there duplicated content between files?

## Workflow

When asked to update or create docs:

1. Read this skill first.
2. Identify which files are affected (use the File Responsibilities table).
3. Read the current state of those files.
4. Make changes following the rules above.
5. Run the checklist.
6. Report: list of changed files + short summary of what and why.
