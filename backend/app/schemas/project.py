from datetime import date
from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

ProjectStatus = Literal["planned", "active", "on_hold", "completed"]


class ProjectSchema(BaseModel):
    """Validated project data shared by API request and response contracts."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    status: ProjectStatus
    start_date: date | None = None
    due_date: date | None = None

    @model_validator(mode="after")
    def due_date_is_not_before_start_date(self) -> Self:
        if (
            self.start_date is not None
            and self.due_date is not None
            and self.due_date < self.start_date
        ):
            raise ValueError("due_date must be on or after start_date")
        return self
