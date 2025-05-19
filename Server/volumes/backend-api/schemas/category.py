from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CategoryBase(BaseModel):
    id: str = Field(
        ...,
        min_length=1,
        max_length=50,
        pattern="^[a-z_][a-z0-9_]*$",
        description="ID semántico de la categoría (slug)"
    )
    name: str = Field(
        ...,
        min_length=2,
        max_length=150,
        description="Nombre descriptivo de la categoría"
    )
    description: Optional[str] = Field(
        None,
        description="Descripción detallada de la categoría"
    )

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=150
    )
    description: Optional[str] = None

class CategoryResponse(CategoryBase):
    created_at: datetime
    updated_at: datetime
    subcategories_count: Optional[int] = Field(
        None,
        description="Número de subcategorías"
    )
    forms_count: Optional[int] = Field(
        None,
        description="Número de formularios en esta categoría"
    )

    class Config:
        from_attributes = True

class CategoryWithSubcategories(CategoryResponse):
    subcategories: List["SubcategoryResponse"] = []

    class Config:
        from_attributes = True

class CategorySimple(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True

# Para evitar referencias circulares
from .subcategory import SubcategoryResponse
CategoryWithSubcategories.model_rebuild()