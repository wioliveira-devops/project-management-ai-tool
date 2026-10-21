"""Validated API response for an AI-generated project summary."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.project_health import ProjectHealthStateSchema


class ProjectSummarySchema(BaseModel):
    """AI summary accompanied by the deterministic health snapshot it used."""

    model_config = ConfigDict(extra="forbid")

    summary: str = Field(min_length=1)
    health_state: ProjectHealthStateSchema
    analysis_date: date
    generated_at: datetime
