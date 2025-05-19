from pydantic import BaseModel, Field, constr
from typing import Optional
from enum import Enum

class CapabilityValue(str, Enum):
    TRUE = 'true'
    FALSE = 'false'
    OWN_ONLY = 'own_only'
    UNPUBLISHED_ONLY = 'unpublished_only'
    STRUCTURE_ONLY = 'structure_only'

class PermissionTypeCapabilityBase(BaseModel):
    permission_type_id: int
    capability_id: int
    value: CapabilityValue

class PermissionTypeCapabilityCreate(PermissionTypeCapabilityBase):
    pass

class PermissionTypeCapabilityUpdate(BaseModel):
    value: CapabilityValue

class PermissionTypeCapabilityResponse(PermissionTypeCapabilityBase):
    class Config:
        from_attributes = True

# Para operaciones en lote
class BulkCapabilityAssignment(BaseModel):
    permission_type_id: int
    capabilities: list[dict[str, CapabilityValue]] = Field(
        ...,
        description="Lista de pares capability_id:valor para asignar"
    )

# Para respuestas que incluyen detalles del tipo y la capacidad
class PermissionTypeCapabilityDetail(PermissionTypeCapabilityBase):
    permission_type_name: str
    capability_name: str

    class Config:
        from_attributes = True