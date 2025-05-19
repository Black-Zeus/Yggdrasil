from pydantic import BaseModel, Field
from datetime import datetime

class ResponseAnswerBase(BaseModel):
    response_id: int
    question_id: int
    answer: dict = Field(..., description="Respuesta en formato libre")

class ResponseAnswerCreate(ResponseAnswerBase):
    pass

class ResponseAnswerUpdate(BaseModel):
    answer: dict

class ResponseAnswerResponse(ResponseAnswerBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
