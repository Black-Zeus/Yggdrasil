from pydantic import BaseModel, Field, constr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class CapabilityValue(str, Enum):
    TRUE = 'true'
    FALSE = 'false'
    OWN_ONLY = 'own_only'
    UNPUBLISHED_ONLY = 'unpublished_only'
    STRUCTURE_ONLY = 'structure_only'

class PermissionTypeBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=30, pattern="^[a-z_][a-z0-9_]*$")
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    is_active: bool = True

class PermissionTypeCreate(PermissionTypeBase):
    capabilities: Optional[List[dict]] = Field(None, description="Lista de capacidades y sus valores")

class PermissionTypeUpdate(BaseModel):
    code: Optional[str] = Field(None, min_length=1, max_length=30, pattern="^[a-z_][a-z0-9_]*$")
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    capabilities: Optional[List[dict]] = None

class CapabilityAssignment(BaseModel):
    capability_id: int
    value: CapabilityValue

class PermissionTypeCapabilityUpdate(BaseModel):
    capabilities: List[CapabilityAssignment]

class PermissionTypeResponse(PermissionTypeBase):
    id: int
    created_at: datetime
    capabilities: Optional[List[dict]] = None

    class Config:
        from_attributes = True

class PermissionTypeSimple(BaseModel):
    id: int
    code: str
    name: str
    is_active: bool

    class Config:
        from_attributes = True

class PermissionTypeWithCapabilities(PermissionTypeResponse):
    capabilities: List[dict] = Field(..., description="Lista detallada de capacidades y sus valores")

    class Config:
        from_attributes = True