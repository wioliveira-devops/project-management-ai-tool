from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    """Expose the API health check over HTTP."""
    return {"status": "ok"}
