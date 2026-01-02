# Repository Guidelines

## Project Structure & Module Organization

This repository is currently a blank workspace. As you add code, keep the structure predictable:
- `src/` for application code
- `tests/` for automated tests
- `public/` or `assets/` for static files (images, fonts, etc.)
- `docs/` for architecture notes or design decisions

If you introduce a framework, follow its defaults (for example, Next.js uses `app/` or `pages/`).

## Build, Test, and Development Commands

Build and test tooling is configured in `package.json` scripts:
- `npm run dev` for local development
- `npm run build` for production builds
- `npm test` for the full test suite
- `npm run test:unit` for unit tests (Vitest)
- `npm run test:integration` for integration tests (Playwright)

Update this section when those commands exist.

## Coding Style & Naming Conventions

Keep code formatting consistent within each language:
- Indentation: 2 spaces for JavaScript/TypeScript or 4 spaces for Python.
- Filenames: `kebab-case` for files and folders, `PascalCase` for components, `camelCase` for variables and functions.
- Prefer descriptive names and short modules.

If you add a formatter or linter (for example, Prettier or ESLint), document the config file (like `.prettierrc` or `.eslintrc`).

## Testing Guidelines

Testing is not yet set up. When you add a framework, document it here and follow a consistent naming pattern:
- Unit tests alongside modules (`src/foo.test.ts`) or in `tests/` (`tests/foo.test.ts`).
- Keep tests small and focused.

## Commit & Pull Request Guidelines

This repository has no commit history to infer conventions. Until patterns emerge:
- Use short, imperative commit messages like `Add homepage layout` or `Fix navbar spacing`.
- Include context in PR descriptions: what changed, why, and how to test.
- Add screenshots for UI changes and link relevant issues if available.

## Agent-Specific Instructions

If you add automation, CI, or platform-specific setup steps, document them in this file to keep contributors aligned.
