# Git Commit Messages
When generating Git commit messages for this repository:
- Always use Conventional Commits format: `<type>(<scope>): <short imperative summary in English>`
- Allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`
- Extract the Jira ticket key (e.g., `TES-10`) from the current git branch name and use it as the `<scope>`
- Keep the first line under 72 characters and do not end with a period
- Example: `feat(TES-10): add User entity, AppDbContext, and initial MySQL migration`
