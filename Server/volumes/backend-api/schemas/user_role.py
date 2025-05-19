from pydantic import BaseModel
from typing import Optional

# Base para operaciones de creación y validación
class UserRoleBase(BaseModel):
    user_id: int
    role_id: int

    class Config:
        from_attributes = True

# Esquema para creación de UserRole
class UserRoleCreate(UserRoleBase):
    pass

# Esquema para actualizar UserRole (con campos opcionales)
class UserRoleUpdate(BaseModel):
    user_id: Optional[int] = None
    role_id: Optional[int] = None

    class Config:
        from_attributes = True

# Esquema para la respuesta de UserRole
class UserRoleResponse(UserRoleBase):
    id: int  # Si el ID es parte de la respuesta

    class Config:
        from_attributes = True
