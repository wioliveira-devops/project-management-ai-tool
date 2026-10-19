"""Small endpoint used to check whether the API is responding."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    """Return a simple success response to an HTTP health-check request."""
    return {"status": "ok"}
