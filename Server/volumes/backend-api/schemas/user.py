from pydantic import BaseModel, EmailStr, Field, model_validator
from typing import Optional, Union
from datetime import datetime
from schemas.status_type import StatusTypeMinimal


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr
    institutional_email: Optional[EmailStr] = None
    status_id: int

class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr
    institutional_email: Optional[Union[EmailStr, str]] = None
    password: str = Field(..., min_length=8)

    @model_validator(mode="before")
    @classmethod
    def empty_string_to_none(cls, values):
        if values.get("institutional_email") == "":
            values["institutional_email"] = None
        return values

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=150)
    institutional_email: Optional[EmailStr] = None
    status_id: Optional[int] = None
    password: Optional[str] = Field(None, min_length=8)    
        
    @model_validator(mode="before")
    @classmethod
    def empty_string_to_none(cls, values):
        if values.get("institutional_email") == "":
            values["institutional_email"] = None
        return values

class UserResponse(UserBase):
    id: int
    email_verified_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserSimple(BaseModel):
    id: int
    full_name: str

    class Config:
        from_attributes = True

class UserResponseFull(BaseModel):
    id: int
    full_name: str
    email: str
    institutional_email: Optional[str] = None
    status: StatusTypeMinimal
    email_verified_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        
class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=8, description="Contraseña actual del usuario")
    new_password: str = Field(..., min_length=8, description="Nueva contraseña que se desea establecer")

    @model_validator(mode="after")
    def validate_passwords(self) -> "ChangePasswordRequest":
        if self.current_password == self.new_password:
            raise ValueError("La nueva contraseña no puede ser igual a la actual.")
        return self

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Correo electrónico registrado del usuario")
    password: str = Field(..., min_length=8, description="Contraseña del usuario")
    
class RecoverPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Correo electrónico del usuario para recuperación")

class ResetPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Correo electrónico del usuario")
    reset_token: str = Field(..., min_length=8, description="Token de recuperación entregado por correo")
    new_password: str = Field(..., min_length=8, description="Nueva contraseña que se desea establecer")

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Token de refresco obtenido durante el login")
    
    class Config:
        schema_extra = {
            "example": {
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }