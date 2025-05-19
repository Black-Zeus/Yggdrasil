from pydantic import BaseModel, Field
from datetime import datetime

class QuestionOptionBase(BaseModel):
    question_id: int
    value: str = Field(..., max_length=100)
    label: str = Field(..., max_length=255)

class QuestionOptionCreate(QuestionOptionBase):
    pass

class QuestionOptionUpdate(BaseModel):
    value: str = Field(..., max_length=100)
    label: str = Field(..., max_length=255)

class QuestionOptionResponse(QuestionOptionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
