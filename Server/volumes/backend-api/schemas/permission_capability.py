from pydantic import BaseModel, Field, constr
from typing import Optional, List
from datetime import datetime
from .permission_type import CapabilityValue

class PermissionCapabilityBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=30, pattern="^[a-z_][a-z0-9_]*$")
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None

class PermissionCapabilityCreate(PermissionCapabilityBase):
    pass

class PermissionCapabilityUpdate(BaseModel):
    code: Optional[str] = Field(None, min_length=1, max_length=30, pattern="^[a-z_][a-z0-9_]*$")
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None

class TypeCapabilityBase(BaseModel):
    permission_type_id: int
    capability_id: int
    value: CapabilityValue

class TypeCapabilityCreate(TypeCapabilityBase):
    pass

class TypeCapabilityUpdate(BaseModel):
    value: CapabilityValue

class PermissionCapabilityResponse(PermissionCapabilityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PermissionCapabilityWithTypes(PermissionCapabilityResponse):
    permission_types: List[dict] = Field(..., description="Lista de tipos de permisos que usan esta capacidad")

class PermissionCapabilitySimple(BaseModel):
    id: int
    code: str
    name: str

    class Config:
        from_attributes = True

class TypeCapabilityResponse(TypeCapabilityBase):
    permission_type: dict
    capability: dict

    class Config:
        from_attributes = True

# Para asignaciones masivas de capacidades
class BulkCapabilityAssignment(BaseModel):
    permission_type_id: int
    capabilities: List[dict] = Field(..., description="Lista de capacidades y sus valores a asignar")