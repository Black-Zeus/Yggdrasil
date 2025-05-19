from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class OperatingSystemEnum(str, Enum):
    ANDROID = "ANDROID"
    IOS = "IOS"

class DeviceBase(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=150,
        description="Nombre del dispositivo"
    )
    brand: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Marca del dispositivo"
    )
    model: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Modelo del dispositivo"
    )
    device_physical_id: str = Field(
        ...,
        min_length=2,
        max_length=200,
        description="ID físico o serial único del dispositivo"
    )
    operating_system: OperatingSystemEnum = Field(
        ...,
        description="Sistema operativo (Android/iOS)"
    )

class DeviceRegisterRequest(DeviceBase):
    register_code: str = Field(
        ...,
        min_length=36,
        max_length=36,
        description="Código de registro previamente generado"
    )
    
class DeviceCreate(DeviceBase):
    register_code: str
    user_id: Optional[int] = None
    status_id: int = 3  # Default: pending (este valor debería venir de constants.DEVICE_STATUS_PENDING)

class DeviceUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=150
    )
    brand: Optional[str] = Field(
        None,
        min_length=2,
        max_length=100
    )
    model: Optional[str] = Field(
        None,
        min_length=2,
        max_length=100
    )
    device_physical_id: Optional[str] = Field(
        None,
        min_length=2,
        max_length=200
    )
    user_id: Optional[int] = None
    status_id: Optional[int] = None
    operating_system: Optional[OperatingSystemEnum] = None

class DeviceResponse(DeviceBase):
    id: int
    user_id: Optional[int] = None
    status_id: int
    register_code: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RegisterCodeResponse(BaseModel):
    register_code: str = Field(
        ...,
        description="Código de registro generado"
    )
    message: str = Field(
        ...,
        description="Mensaje de estado"
    )

class DeviceSimple(BaseModel):
    id: int
    name: str
    brand: str
    model: str
    operating_system: OperatingSystemEnum

    class Config:
        from_attributes = True
        
        
class DeviceStatusUpdate(BaseModel):
    register_code: str = Field(..., example="550e8400-e29b-41d4-a716-446655440000")
    status_id: int = Field(..., ge=1, le=3, example=1, description="Estado del dispositivo: 1=Activo, 2=Inactivo, 3=Pendiente")

    class Config:
        schema_extra = {
            "example": {
                "register_code": "550e8400-e29b-41d4-a716-446655440000",
                "status_id": 1
            }
        }