from fastapi import FastAPI

app = FastAPI(
    title="Project Management AI Tool API",
    version="0.1.0",
)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
