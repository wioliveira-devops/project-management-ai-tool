# Project Management AI Tool

An AI-assisted project management application designed to help project managers understand project status, identify risks, and make informed decisions.

## Technology Stack

- **Frontend:** React, TypeScript, and Vite
- **Backend:** Python and FastAPI
- **Frontend quality:** ESLint and TypeScript
- **Backend quality:** Ruff
- **Future storage:** SQLite
- **Future AI integration:** OpenAI API, accessed through the backend

## Project Structure

```text
project-management-ai-tool/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py
│   └── pyproject.toml
├── data/
├── docs/
├── frontend/
├── .gitignore
└── README.md
```

The backend virtual environment (`backend/.venv/`) and frontend dependencies (`frontend/node_modules/`) are local development artifacts and should not be committed.

## Prerequisites

Install the following tools:

- Git
- Node.js and npm
- Python 3.14 or another Python version compatible with the project's dependencies
- Visual Studio Code (recommended)

## Getting Started

### 1. Frontend

Open a terminal at the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173/`.

To validate the frontend:

```powershell
npm run lint
npm run build
```

### 2. Backend

Open a second terminal at the repository root:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install "fastapi[standard]" ruff
```

Start the API:

```powershell
fastapi dev app/main.py
```

The API will usually be available at `http://127.0.0.1:8000`.

### 3. Verify the API

Health endpoint:

`http://127.0.0.1:8000/api/health`

Expected response:

```json
{"status": "ok"}
```

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### 4. Backend quality checks

Run these commands from the `backend` directory with the virtual environment activated:

```powershell
ruff check .
ruff format --check .
```

## Current Scope

The initial application skeleton provides a working frontend development environment and a minimal FastAPI backend with a health endpoint.

Database persistence, project management features, AI-powered analysis, automated tests, and deployment will be introduced incrementally in subsequent development tasks.

## Security

- Never commit API keys, passwords, or other secrets.
- Keep local environment files out of version control.
- Store future OpenAI API credentials on the backend, never in frontend code.
