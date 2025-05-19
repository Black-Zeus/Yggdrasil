from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class StatusType(BaseModel):
    id: Optional[int] = None
    code: str = Field(..., max_length=30)
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StatusTypeCreate(BaseModel):
    code: str = Field(..., max_length=30)
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    is_active: bool = True


class StatusTypeUpdate(BaseModel):
    code: Optional[str] = Field(None, max_length=30)
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    
class StatusTypeResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
        
class StatusTypeSimple(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
        
class StatusTypeMinimal(BaseModel):
    id: int
    code: str
    description: Optional[str]

    class Config:
        from_attributes = True
