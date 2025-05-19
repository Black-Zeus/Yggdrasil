from pydantic import BaseModel, Field
from datetime import datetime

class QuestionItemBase(BaseModel):
    question_id: int
    item_uid: str = Field(..., max_length=50)
    label: str = Field(..., max_length=255)

class QuestionItemCreate(QuestionItemBase):
    pass

class QuestionItemUpdate(BaseModel):
    item_uid: str = Field(..., max_length=50)
    label: str = Field(..., max_length=255)

class QuestionItemResponse(QuestionItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
