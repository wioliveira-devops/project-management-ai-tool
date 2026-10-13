# Coding and Naming Standards

Use these conventions for new code and follow them when editing existing code. Prefer descriptive names, consistent with the language and toolchain, over abbreviations or clever wordplay. Use `id`, `API`, and other widely understood technical terms where they improve clarity.

## Readability, maintainability, and typing

- Keep functions and components focused on one responsibility. Prefer straightforward code over clever shortcuts, premature abstractions, or duplicated configuration.
- Use descriptive names and small, cohesive modules. Add comments to explain non-obvious decisions, not to restate what the code already says.
- Give data crossing module or API boundaries an explicit type. Prefer narrow, accurate types; avoid TypeScript `any` and use `unknown` when a value must be checked before use.
- Add Python type annotations to functions and use Pydantic schemas to validate API data. Keep validation and business rules in the appropriate backend modules.
- Handle expected errors clearly and avoid silently ignoring failures.
- Follow the existing ESLint and Ruff rules. Use Ruff's formatter for Python rather than introducing a second formatting tool.

## Files and directories

- Use lowercase directory names. Use one word where possible and kebab-case for multiword frontend or documentation directories, for example `api/` and `project-dashboard/`. Python package directories use snake_case.
- Use kebab-case for Markdown documents, for example `data-model.md` and `coding-standards.md`.
- In the frontend, name React component files in PascalCase and use the `.tsx` extension, for example `ApiStatus.tsx`. Name hook files `use` followed by PascalCase, for example `useApiHealth.ts`. Name API, type, and utility modules in lowercase; use kebab-case for multiword names, for example `health.ts` and `project-api.ts`.
- Name frontend CSS files after their component in PascalCase, such as `App.css`; use `index.css` for global styles. Use kebab-case for CSS classes and custom properties, such as `.status-card` and `--surface-color`.
- In the backend, use snake_case for Python module and package names, for example `health.py` and `schemas/`. Keep Python's special `__init__.py` spelling for package initialization.

## React and TypeScript

- Name React components and component files in PascalCase: `ApiStatus` in `ApiStatus.tsx`.
- Name hooks with the `use` prefix followed by PascalCase: `useApiHealth` in `useApiHealth.ts`.
- Use camelCase for functions, variables, parameters, and local constants: `checkApiHealth`, `projectId`, `errorMessage`.
- Use PascalCase for interfaces, type aliases, and enum-like types: `Project`, `Task`, `TaskStatus`.
- Prefer `interface` for object shapes and `type` for unions or composed types.
- Keep API contract property names in snake_case when they mirror the backend JSON, such as `project_id` and `due_date`. Use camelCase for local variables and function names.
- Use uppercase snake_case for environment variable names, for example `VITE_API_BASE_URL`.

## Python and FastAPI

- Use snake_case for modules, functions, methods, variables, and function parameters: `health_check`, `project_id`.
- Use PascalCase for classes, including Pydantic schemas: `ProjectSchema`, `TaskSchema`.
- Use PascalCase for type aliases and UPPER_SNAKE_CASE for module-level constants: `TaskStatus`, `DEFAULT_TIMEOUT_SECONDS`.
- Give Pydantic schema classes a descriptive domain name with the `Schema` suffix. Keep field names in snake_case to match the JSON contract.
- Use the existing Ruff configuration for import ordering, lint rules, double-quoted strings, and formatting.

## API endpoints

- Keep API routes under `/api`.
- Use lowercase path segments and plural nouns for resource collections: `/api/projects` and `/api/tasks`.
- Nest related resources under their parent: `/api/projects/{project_id}/tasks`.
- Use snake_case for path and query parameter names to match Python identifiers and the JSON contract.
- Use HTTP methods to express the operation (`GET`, `POST`, `PUT`/`PATCH`, `DELETE`); avoid verb-based route names. Use lowercase kebab-case for a multiword path segment when needed.
- Do not add a trailing slash. Keep `/api/health` as the simple operational health-check exception.

## Examples from this repository

| Purpose | Convention | Example |
|---|---|---|
| React component | PascalCase file and function | `ApiStatus.tsx`, `ApiStatus` |
| React hook | `use` + PascalCase | `useApiHealth.ts`, `useApiHealth` |
| Frontend module | lowercase or kebab-case | `health.ts`, `project-api.ts` |
| TypeScript contract | PascalCase type; API fields mirror JSON | `Task`, `project_id`, `due_date` |
| Python module and function | snake_case | `health.py`, `health_check` |
| Pydantic schema | PascalCase + `Schema` | `TaskSchema` |
| API collection route | lowercase plural resource | `GET /api/projects` |

## Development and validation workflow

Run the checks from the relevant project directory in PowerShell. Run them before committing changes that touch that part of the application.

### Frontend

From `frontend/`:

```powershell
npm run lint
npm run build
```

`npm run lint` runs ESLint. `npm run build` runs the TypeScript project checks before creating the Vite production build.

### Backend

From `backend/`, with the project virtual environment active (or invoke its executables directly):

```powershell
ruff check .
ruff format --check .
```

`ruff check .` checks the configured lint rules and import order. `ruff format --check .` verifies formatting without changing files. To apply formatting after editing Python files, run `ruff format .`, then rerun both checks.

Do not add linters, formatters, or automation without a project need and agreement. When a check fails, fix the relevant issue and rerun the check before committing.
