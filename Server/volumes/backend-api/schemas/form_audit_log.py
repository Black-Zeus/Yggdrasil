from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FormAuditLogBase(BaseModel):
    form_id: int
    user_id: Optional[int] = None
    action: str = Field(..., max_length=50)
    details: Optional[dict] = None

class FormAuditLogCreate(FormAuditLogBase):
    pass

class FormAuditLogResponse(FormAuditLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
