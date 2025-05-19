from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FormPermissionBase(BaseModel):
    form_id: int
    user_id: Optional[int] = Field(None, description="Solo si es un permiso individual")
    role_id: Optional[int] = Field(None, description="Solo si es un permiso por rol")
    permission_type_id: int
    expires_at: Optional[datetime] = None
    granted_by: int
    is_active: Optional[bool] = True

class FormPermissionCreate(FormPermissionBase):
    pass

class FormPermissionUpdate(BaseModel):
    expires_at: Optional[datetime] = None
    is_active: Optional[bool] = None

class FormPermissionResponse(FormPermissionBase):
    id: int
    granted_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
