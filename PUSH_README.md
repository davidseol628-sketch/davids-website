# prepare_push helper

This repository includes a safe helper script to prepare commits and pushes without pushing by default.

File: scripts/prepare_push.sh

Basic behavior
- Prints the repository status and the git commands it would run.
- Does not stage, commit, checkout, or push unless you enable actions via environment variables.

Environment variables
- `AUTO_STAGE=1` — run `git add -A` before committing.
- `COMMIT_MSG="Your message"` — commit message to use.
- `BRANCH=branch-name` — target branch (defaults to `work-YYYYMMDDHHMMSS`).
- `GIT_REMOTE_URL=https://github.com/owner/repo.git` — adds `origin` if missing.
- `PUSH=1` — actually perform checkout/add/commit/push; without this the script only prints commands.

Examples

Dry-run (safe):

```sh
./scripts/prepare_push.sh
```

Stage, commit, and push to a new branch:

```sh
AUTO_STAGE=1 COMMIT_MSG="Fix styles" BRANCH=fix/styles PUSH=1 ./scripts/prepare_push.sh
```

Add remote and push (if origin missing):

```sh
GIT_REMOTE_URL=https://github.com/owner/repo.git AUTO_STAGE=1 COMMIT_MSG="WIP" PUSH=1 ./scripts/prepare_push.sh
```

Review the printed commands before enabling `PUSH=1`.
