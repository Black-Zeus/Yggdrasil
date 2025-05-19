from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SubcategoryBase(BaseModel):
    id: str = Field(
        ...,
        min_length=1,
        max_length=50,
        pattern="^[a-z_][a-z0-9_]*$",
        description="ID semántico de la subcategoría (slug)"
    )
    category_id: str
    name: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = None

class SubcategoryCreate(SubcategoryBase):
    pass

class SubcategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = None

class SubcategoryResponse(SubcategoryBase):
    created_at: datetime
    updated_at: datetime
    forms_count: Optional[int] = Field(None, description="Número de formularios asociados")

    class Config:
        from_attributes = True

class SubcategorySimple(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True
