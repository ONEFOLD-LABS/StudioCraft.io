# StudioCraft website – guide for AI agents

This file is for AI coding agents and the people who run them. `CLAUDE.md` points here. The
rules of the StudioCraft repository (`AGENTS.md` there) apply as well; this file adds what is
specific to the website. How the site is built is described in `README.md`.

## Rules

- **A person is accountable** for every commit and pull request an agent produces. Read the diff
  before you open a pull request.
- **`main` changes only through a pull request** with green CI. Every push to `main` publishes
  the site (`.github/workflows/pages.yml`).
- **One feature at a time, linear history.** Start each change on a new branch from the current
  `origin/main`, open its pull request, and merge it with **Rebase and merge** as soon as CI is
  green; then delete the branch and start the next change from the new `main`. Do not stack pull
  requests on top of each other and do not leave branches, worktrees or pull requests lying
  around. If `main` moved, `git rebase origin/main` (never merge `main` into the branch);
  `main` has no merge commits.
- **No JavaScript.** The site is static HTML and CSS, built by the Rust generator in
  `src/main.rs` (standard library only).
- **Clean room.** Texts, images and icons are original or openly licensed and credited in
  `NOTICE`. Do not name other products or their vendors.
- **Licences**: permissive only (see the StudioCraft repository's `AGENTS.md`); anything else, stop and
  ask a maintainer.
- **Report only what ran**, and keep secrets and personal data out of the repository.

## Gate: run before every commit

```sh
cargo fmt --check && cargo clippy --all-targets -- -D warnings && cargo test && cargo run
```

Look at the pages in `dist/` in a browser after changing texts, layout or styles.

## Commits and pull requests

- Commit messages in **English**, imperative subject (≤ 72 chars), body explaining what and why.
- Branch names: `feat/…`, `fix/…`, `docs/…`, `ci/…`.
