from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class MenuItemBase(BaseModel):
    label: str
    path: str
    icon: Optional[str] = None
    order: int = 0
    is_active: bool = True
    parent_id: Optional[int] = None

class MenuItemResponse(MenuItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class MenuItemWithChildren(MenuItemResponse):
    children: List["MenuItemWithChildren"] = Field(default_factory=list)

    class Config:
        from_attributes = True

MenuItemWithChildren.model_rebuild()

class MenuItemTree(BaseModel):
    items: List[MenuItemWithChildren]
 