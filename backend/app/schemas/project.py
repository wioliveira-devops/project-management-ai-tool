"""Pydantic models that validate project data returned by the API."""

from datetime import date
from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

ProjectStatus = Literal["planned", "active", "on_hold", "completed"]
# Literal limits a status to these named choices instead of accepting any text.


class ProjectOwnerSchema(BaseModel):
    """Owner name and role shown in the project overview."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: str = Field(min_length=1)
    role: str = Field(min_length=1)


class ProjectSchema(BaseModel):
    """Project fields and rules used to validate an API response."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    description: str = ""
    owner: ProjectOwnerSchema | None = None
    status: ProjectStatus
    start_date: date | None = None
    target_end_date: date | None = None

    @model_validator(mode="after")
    def target_end_date_is_not_before_start_date(self) -> Self:
        """Reject a project whose target finish date comes before its start."""
        if (
            self.start_date is not None
            and self.target_end_date is not None
            and self.target_end_date < self.start_date
        ):
            raise ValueError("target_end_date must be on or after start_date")
        return self
