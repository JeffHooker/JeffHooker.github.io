# Claude Code Guidelines — JeffHooker.github.io

## Branch Workflow

- **Never commit or push directly to `main`.** All changes go to a feature branch first.
- Create a feature branch for each task: `git checkout -b feature/description`
- `main` is production. It should only be updated via pull request or explicit user instruction.

## Before Any Push (git or MCP push_files)

- Verify the file size/line count matches expectations before pushing.
- For large files (>100 lines), confirm the local line count: `wc -l <file>`
- After pushing via MCP `push_files`, confirm with `mcp__github__get_file_contents` that the remote file size is reasonable — a dramatically smaller file than expected means something went wrong.

## On Push Failure

- **Stop and report to the user. Do not retry automatically.**
- A failed push should surface as: "Push failed: [reason]. Please advise."
- Retrying a broken push can compound the damage (partial writes, truncated files).

## Local Commits

- Always make a local `git commit` before attempting any remote push.
- This ensures the correct state is preserved locally even if the remote push fails.
- Never rely solely on MCP `push_files` without a corresponding local commit.
