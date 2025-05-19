from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FormQuestionBase(BaseModel):
    form_id: int
    question_uid: Optional[str] = Field(None, max_length=50)
    order: Optional[int] = 0
    title: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    type: str
    prompt: Optional[str] = None
    is_required: Optional[bool] = False
    validation: Optional[dict] = None
    extra_config: Optional[dict] = None
    status_id: int

class FormQuestionCreate(FormQuestionBase):
    pass

class FormQuestionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    prompt: Optional[str] = None
    is_required: Optional[bool] = None
    validation: Optional[dict] = None
    extra_config: Optional[dict] = None
    status_id: Optional[int] = None

class FormQuestionResponse(FormQuestionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
