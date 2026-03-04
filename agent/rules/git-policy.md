# Git Execution Policy

## Restrictions
- **DO NOT** execute any `git push` or `git remote` commands without explicit verbal confirmation for each instance.
- **DO NOT** modify the `.git` directory directly.
- **DO NOT** create, delete, or force-push branches unless specifically instructed.

## Required Workflow
- Before any commit, you must show a summary of the changes you intend to stage.
- Always use the `git status` command to verify the current state before attempting any write operations.
- If you are unsure of the remote repository's state, ask me to run `git fetch` manually first.

# Privacy & Security Rules

- **Access Denial:** You are strictly prohibited from accessing, reading, or referencing the `.git` directory or any files within it (e.g., `.git/config`, `.git/HEAD`).
- **Context Limitation:** Do not attempt to use Git history (commits, authors, or diffs) to inform your code suggestions. Use only the active source code in the workspace.