from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class RoleBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=30, pattern="^[a-zA-Z_][a-zA-Z0-9_]*$")
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    code: Optional[str] = Field(None, min_length=1, max_length=30, pattern="^[a-zA-Z_][a-zA-Z0-9_]*$")
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None

class RoleResponse(RoleBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RoleWithUsers(RoleResponse):
    user_count: int

class RoleWithPermissions(RoleResponse):
    permissions: List[str]  # Lista de códigos de permisos

# Para respuestas que solo necesitan información básica del rol
class RoleSimple(BaseModel):
    id: int
    code: str
    name: str

    class Config:
        from_attributes = True