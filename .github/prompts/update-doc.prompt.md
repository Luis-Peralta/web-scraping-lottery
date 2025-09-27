---
mode: agent
---
Analyze the changes made in this branch (BRANCH_NAME) compare with main branch and update the corresponding sections in `readme.md` so that the documentation accurately reflects the new or modified functionality.

Instructions:
- Keep the language simple, clear, and professional.
- You will be provided with the branch name and the `git diff` output.
- If no documentation updates are needed, reply with: `No updates needed`.
- Return the updated `readme.md` content as Markdown.
- Run `git diff` to analyze the changes made in the branch.
- Run `git status` to obtain the branch name.
- location: `./readme.md`