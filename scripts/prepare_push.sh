#!/usr/bin/env bash
set -euo pipefail

# Safe helper to prepare a push without pushing by default.
# Usage: set env vars and run, or inspect the printed commands first.

DRY_RUN=true
AUTO_STAGE=${AUTO_STAGE:-0}
PUSH=${PUSH:-0}
BRANCH=${BRANCH:-}
COMMIT_MSG=${COMMIT_MSG:-}
GIT_REMOTE_URL=${GIT_REMOTE_URL:-}

print_header() {
  echo "==> $1"
}

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository. Initialize one or run this inside the repo."
  exit 1
fi

print_header "Repository status"
git status --short

if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit. Exiting." && exit 0
fi

if [ -n "$GIT_REMOTE_URL" ] && ! git remote | grep -q '^origin$'; then
  print_header "Adding remote 'origin' => $GIT_REMOTE_URL"
  echo "git remote add origin $GIT_REMOTE_URL"
  if [ "$PUSH" = "1" ] || [ "$AUTO_STAGE" = "1" ]; then
    git remote add origin "$GIT_REMOTE_URL"
  fi
fi

if [ -z "$BRANCH" ]; then
  BRANCH="work-$(date +%Y%m%d%H%M%S)"
fi

print_header "Target branch"
echo "$BRANCH"

if git show-ref --verify --quiet refs/heads/$BRANCH; then
  echo "Branch exists locally: checking out $BRANCH"
  echo "git checkout $BRANCH"
  if [ "$PUSH" = "1" ]; then
    git checkout "$BRANCH"
  fi
else
  echo "Create and checkout branch: git checkout -b $BRANCH"
  if [ "$PUSH" = "1" ]; then
    git checkout -b "$BRANCH"
  fi
fi

if [ "$AUTO_STAGE" = "1" ]; then
  print_header "Staging changes"
  echo "git add -A"
  if [ "$PUSH" = "1" ]; then
    git add -A
  fi
else
  echo "To stage changes: git add -A"
fi

if [ -n "$COMMIT_MSG" ]; then
  print_header "Commit"
  echo "git commit -m \"$COMMIT_MSG\""
  if [ "$PUSH" = "1" ]; then
    git commit -m "$COMMIT_MSG"
  fi
else
  echo "To commit: git commit -m \"Your message\""
fi

print_header "Push"
echo "git push -u origin $BRANCH"
if [ "$PUSH" = "1" ]; then
  git push -u origin "$BRANCH"
fi

echo "Done. This script prints the commands it would run by default."
echo "Set environment variables to perform actions: AUTO_STAGE=1 COMMIT_MSG=\"msg\" PUSH=1 GIT_REMOTE_URL=..."
