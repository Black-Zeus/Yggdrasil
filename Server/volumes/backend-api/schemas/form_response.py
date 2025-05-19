from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class FormResponseBase(BaseModel):
    form_id: int
    user_id: Optional[int] = None
    response_token: Optional[str] = None
    ip_address: Optional[str] = None
    manual_signature_key: Optional[str] = None
    signed_by_name: Optional[str] = None
    signed_by_email: Optional[EmailStr] = None
    status_id: int

class FormResponseCreate(FormResponseBase):
    pass

class FormResponseUpdate(BaseModel):
    manual_signature_key: Optional[str] = None
    signed_by_name: Optional[str] = None
    signed_by_email: Optional[EmailStr] = None
    status_id: Optional[int] = None

class FormResponseResponse(FormResponseBase):
    id: int
    submitted_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
