# Architecture — Project Management AI Tool

## 1. Purpose

This document defines the initial technical architecture, technology stack, development approach, and implementation backlog for the Project Management AI Tool.

The application is an AI-assisted intelligence layer for Project Managers and Scrum Masters. It helps monitor project health, identify risks and schedule deviations, and generate actionable insights from project data.

It complements existing project management platforms rather than replacing them. External integrations are planned for future versions.

The architecture should prioritize simplicity, maintainability, security, explainability, and incremental delivery.

## 2. Technology Stack

### 2.1 Selected technologies

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + TypeScript | User interface and dashboard |
| Frontend tooling | Vite | Development server and build tooling |
| Backend | Python + FastAPI | API endpoints and application logic |
| Database | SQLite | Initial persistent project data |
| AI integration | OpenAI API | Project summaries, risk interpretation, and recommendations |
| Frontend testing | Vitest + React Testing Library | Component and frontend logic tests |
| Backend testing | pytest + FastAPI TestClient | API and business logic tests |
| End-to-end testing | Playwright | Validate critical user workflows when the UI stabilizes |
| Version control | Git + GitHub | Source control, code review, and collaboration |
| Project management | GitHub Projects + Issues | Backlog, priorities, and development tracking |

Use current stable, mutually compatible versions when establishing the environment. Record dependencies and versions in the project's configuration files.

### 2.2 Technology principles

- Use TypeScript to reduce common frontend errors.
- Keep business rules in Python rather than embedding them in UI components.
- Use SQLite for the initial single-user MVP; reconsider the database only when requirements justify it.
- Access the OpenAI API exclusively through the backend.
- Keep API keys and other secrets outside source control.
- Avoid microservices, message queues, complex cloud infrastructure, and orchestration platforms in the MVP.
- TypeScript adoption: Use TypeScript with straightforward, explicit types for core domain entities and API contracts. Prefer readable, maintainable code over advanced type-system abstractions. Explain non-obvious TypeScript patterns during code review.

## 3. Architecture

### 3.1 Logical architecture

The application will follow a simple frontend/backend architecture with a clear separation between data, deterministic analysis, and AI interpretation.

```text
Project Manager
      |
      v
React + TypeScript
Dashboard and Insights UI
      |
      | HTTP / JSON
      v
Python + FastAPI
      |
      +----------------------+
      |                      |
      v                      v
Project Data Layer     Analysis Services
      |                      |
      v                      v
SQLite Database        Deterministic Results
                             |
                             v
                       AI Service
                       OpenAI API
                             |
                             v
                       AI Insights
                             |
                             v
                   Project Manager Review
```

The diagram represents logical responsibilities, not separate deployable services. For the MVP, the backend and its analysis services should run as one application.

### 3.2 Main components

**Frontend**

Responsible for displaying project information and enabling the user to review insights.

Initial screens:
- Project dashboard.
- Task and schedule overview.
- Risk and issue overview.
- AI-generated insights and recommendations.

**Backend API**

Responsible for:
- Validating requests and input data.
- Exposing project and task endpoints.
- Applying business rules.
- Coordinating analysis and AI requests.
- Handling errors and returning structured responses.

**Data layer**

Responsible for storing and retrieving projects, tasks, and related information.

The initial data model should support:
- Projects.
- Tasks.
- Status and priority.
- Start dates and due dates.
- Task owners.
- Milestones and dependencies, when needed.

Use a consistent date format and explicit status and priority values.

**Analysis services**

Use deterministic business rules to identify:
- Overdue tasks.
- Tasks approaching their due dates.
- Delayed milestones.
- Blocked tasks and relevant dependency problems.
- Risks and schedule deviations supported by available data.

Rules should be independently testable and should not require an AI API call.

**AI service**

Send a controlled set of project data and analysis results to the OpenAI API to generate:
- Project status summaries.
- Explanations of detected risks.
- Potential corrective actions.
- Prioritized recommendations.

AI output must be presented as recommendations, not verified facts. The application must distinguish source data, calculated results, and AI-generated interpretations.

If the AI service is unavailable, basic project monitoring and deterministic analysis should remain usable.

### 3.3 Data flow

1. The user opens the dashboard.
2. The frontend requests project data from the backend.
3. The backend retrieves and validates the data.
4. Analysis services calculate project indicators and detect issues.
5. The frontend displays the results.
6. When requested, the backend sends relevant context to the AI service.
7. The frontend displays the returned insights with sufficient context for the user to evaluate them.
8. The Project Manager decides whether to act on the recommendations.

AI analysis should initially be user-triggered rather than automatically executed on every dashboard refresh.

### 3.4 Initial API boundaries

Proposed endpoints:

| Endpoint | Responsibility |
|---|---|
| `GET /api/health` | Verify that the backend is running |
| `GET /api/projects` | List projects |
| `GET /api/projects/{project_id}` | Retrieve project details |
| `GET /api/projects/{project_id}/tasks` | Retrieve project tasks |
| `GET /api/projects/{project_id}/analysis` | Calculate project health indicators |
| `POST /api/projects/{project_id}/insights` | Generate AI-assisted insights |

These endpoints are initial design proposals. Implement them incrementally and adjust them only when justified by actual requirements.

### 3.5 Initial data strategy

Start with representative sample project data in a version-controlled JSON file.

Introduce SQLite persistence when the initial data model and core dashboard workflow are validated. Keep sample data separate from application code so it can be reused in tests and demonstrations.

Do not connect Jira, Microsoft Planner, Trello, or other external systems in the first implementation phase.

### 3.6 Security and reliability

- Keep API keys in environment variables or a local, ignored `.env` file.
- Commit an `.env.example` containing placeholder values only.
- Never expose the OpenAI API key to the browser.
- Validate and constrain inputs and external API responses.
- Handle network failures, invalid data, and AI service errors.
- Avoid sending unnecessary or sensitive project information to the AI provider.
- Do not log secrets or complete sensitive project payloads.
- Test critical business rules and API behavior.

Authentication, multi-user access, and enterprise authorization should be designed when the deployment and user requirements are established.

## 4. Initial Repository Structure

Use the following structure as the target for the first implementation phases:

```text
project-management-ai-tool/
├── README.md
├── .gitignore
├── .env.example
├── docs/
│   ├── project-definition.md
│   └── architecture.md
├── frontend/
│   ├── package.json
│   ├── src/
│   └── tests/
├── backend/
│   ├── pyproject.toml
│   ├── app/
│   └── tests/
└── data/
    └── sample-project.json
```

The actual structure may evolve as implementation proceeds. Keep frontend and backend responsibilities separate, and do not create empty modules or abstractions without a concrete need.

SQLite database files, virtual environments, dependency directories, local secrets, and generated build artifacts must not be committed.

## 5. Initial GitHub Issues

Create the following Issues in the existing GitHub repository and associate them with the GitHub Project. Use the listed order as the initial implementation sequence.

### Issue 1 — Set up the development environment

**Goal:** Establish a reproducible local environment for frontend and backend development.

Acceptance criteria:
- Required runtimes and Git are installed and verified.
- Frontend and backend can run locally.
- Dependencies are declared in project configuration files.
- Local secrets and generated files are excluded from Git.
- Setup instructions are documented.

### Issue 2 — Create the initial application skeleton

**Goal:** Establish the frontend/backend structure and a working health check.

Acceptance criteria:
- React and TypeScript frontend starts successfully.
- FastAPI backend starts successfully.
- `GET /api/health` returns a successful response.
- Frontend can communicate with the backend.
- Basic configuration and error handling are in place.

### Issue 3 — Define the project and task data model

**Goal:** Establish a consistent data structure for project monitoring.

Acceptance criteria:
- Project and task fields are documented.
- Valid statuses, priorities, dates, and identifiers are defined.
- Representative sample project data is available.
- Invalid or incomplete data is handled predictably.
- Tests cover the main validation rules.

### Issue 4 — Build the initial project dashboard

**Goal:** Display project information using sample data.

Acceptance criteria:
- Project summary and task list are displayed.
- Status, priority, owner, and due date are visible where applicable.
- Overdue tasks are clearly identified.
- Loading, empty, and error states are handled.
- Frontend components have appropriate tests.

### Issue 5 — Implement deterministic project analysis

**Goal:** Calculate project indicators and detect issues without AI.

Acceptance criteria:
- Overdue tasks are identified correctly.
- Relevant upcoming deadlines and delayed milestones are detected.
- Analysis results are traceable to source data.
- Missing or inconsistent dates are handled.
- Business rules have automated tests.

### Issue 6 — Add SQLite persistence

**Goal:** Store and retrieve project information reliably.

Acceptance criteria:
- Project and task data can be persisted and retrieved.
- Database initialization and schema changes are managed.
- API endpoints use the data layer rather than hardcoded records.
- Tests cover persistence and common failure cases.

### Issue 7 — Integrate AI-generated insights

**Goal:** Generate useful explanations and recommendations from project data and deterministic analysis.

Acceptance criteria:
- AI requests are initiated through the backend.
- Secrets are never exposed to the frontend.
- The AI receives only the context needed for the analysis.
- Responses distinguish observations from recommendations.
- Errors, timeouts, and invalid AI responses are handled.
- AI-generated claims are not treated as verified facts.
- Automated tests cover the AI integration boundary.

### Issue 8 — Validate the end-to-end MVP workflow

**Goal:** Verify that a Project Manager can complete the core monitoring workflow.

Acceptance criteria:
- Project data can be loaded and displayed.
- Relevant schedule problems and risks are identified.
- AI insights can be requested and reviewed.
- Core workflows have automated tests.
- Setup and usage documentation is complete.

Keep each Issue focused. Create smaller Issues or subtasks when implementation becomes too large to review and test comfortably.

## 6. Development Environment Setup

The initial development environment assumes Windows, PowerShell, Git, and a local development workflow.

### 6.1 Prerequisites

Install or verify:
- Git.
- Node.js LTS and npm.
- Python 3.12 or another compatible supported version selected for the project.
- Visual Studio Code or another suitable editor.
- A GitHub account with SSH access configured.

Verify the installed tools:

```powershell
git --version
node --version
npm --version
python --version
```

If Python is exposed as `py` on Windows, use `py --version` instead.

### 6.2 Create the frontend

From the repository root:

```powershell
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

Verify that the Vite development server starts and the initial page loads.

Then configure the frontend test tools:

```powershell
npm install -D vitest @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event jsdom
```

Configure Vitest and add test scripts to `package.json`.

Playwright can be introduced when the first end-to-end workflow is available.

### 6.3 Create the backend

From the repository root:

```powershell
mkdir backend
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install fastapi "uvicorn[standard]" pytest httpx
```

Create `pyproject.toml` to declare the backend dependencies and project configuration. Use a dependency lock or equivalent reproducible dependency-management process.

Create the initial FastAPI application and implement `GET /api/health`.

Run the backend from the `backend` directory:

```powershell
uvicorn app.main:app --reload
```

This command assumes the application entry point will be `backend/app/main.py`.

If PowerShell prevents virtual-environment activation, use an approved local execution-policy approach or run the virtual environment's Python executable directly. Do not weaken system-wide security settings unnecessarily.

### 6.4 Configure Git and local secrets

Review `.gitignore` and ensure it excludes at least:

```gitignore
# Python
__pycache__/
*.py[cod]
.venv/
.pytest_cache/

# Node.js
node_modules/
dist/
coverage/

# Environment and secrets
.env
.env.*
!.env.example

# Local databases
*.db
*.sqlite
*.sqlite3

# Editors and operating system
.vscode/
.DS_Store
```

Adjust these entries as the project evolves. Keep `.env.example` free of real credentials.

### 6.5 Configure AI access

After the basic application and analysis workflow are working:

1. Obtain an OpenAI API key through the appropriate OpenAI developer account.
2. Store it in a local environment configuration file excluded from Git.
3. Load it only in the backend.
4. Use the official OpenAI Python SDK and declare it as a backend dependency.
5. Test the integration with controlled sample data.
6. Mock the AI service in most automated tests to avoid unnecessary API calls and unpredictable test results.

AI integration should not block development of the dashboard or deterministic analysis.

### 6.6 Development workflow

For each GitHub Issue:

1. Review the requirements and acceptance criteria.
2. Create a dedicated branch from the current `main`.
3. Ask Codex to implement only the Issue's scope.
4. Review the generated code and understand the changes.
5. Run relevant automated tests and manually verify the behavior.
6. Commit with a descriptive message.
7. Open a pull request and review the diff before merging.
8. Update the GitHub Issue and Project.

Do not allow Codex to introduce new frameworks, dependencies, architectural patterns, or scope expansions without explaining the need and obtaining approval.

## 7. Definition of Done

A development task is complete when:

- Its acceptance criteria are satisfied.
- Relevant automated tests pass.
- Changes are reviewed and understandable.
- No secrets or unnecessary generated files are committed.
- Documentation is updated when needed.
- The feature is integrated through the agreed GitHub workflow.

## 8. Implementation Roadmap

Implement the application in small, verifiable increments:

1. **Foundation:** Repository structure, development tools, health check, and sample data.
2. **Core dashboard:** Project and task display, status indicators, and deterministic analysis.
3. **Persistence:** SQLite and database-backed API endpoints.
4. **AI insights:** Controlled AI integration and reviewable recommendations.
5. **MVP validation:** End-to-end testing, documentation, and user feedback.

External integrations, advanced automation, multi-user features, and deployment infrastructure should follow only after the core MVP has been validated.

---

**Architectural principle:** Build a reliable project monitoring application first, then add AI as a controlled intelligence layer. Every recommendation must be grounded in available project data, and the Project Manager remains responsible for decisions.