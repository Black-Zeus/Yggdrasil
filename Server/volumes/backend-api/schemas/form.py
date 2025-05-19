from pydantic import BaseModel, Field, UUID4
from typing import Optional, List, Literal
from datetime import datetime, date, time

class FormBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    category_id: Optional[str] = None
    subcategory_id: Optional[str] = None
    visibility: Optional[str] = Field(default="Privada")
    allow_anonymous: Optional[bool] = False
    require_institutional_email: Optional[bool] = False
    limit_one_response: Optional[bool] = False
    require_signature: Optional[bool] = False
    deadline: Optional[date] = None
    deadline_time: Optional[time] = None
    version_number: Optional[int] = 1
    parent_form_id: Optional[int] = None
    draft_data: Optional[dict] = None
    preview_config: Optional[dict] = None
    additional_options: Optional[dict] = None
    status_id: int
    created_by: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class FormCreate(FormBase):
    uuid: UUID4

class FormUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None
    visibility: Optional[str] = None
    allow_anonymous: Optional[bool] = None
    require_institutional_email: Optional[bool] = None
    limit_one_response: Optional[bool] = None
    require_signature: Optional[bool] = None
    deadline: Optional[date] = None
    deadline_time: Optional[time] = None
    draft_data: Optional[dict] = None
    preview_config: Optional[dict] = None
    additional_options: Optional[dict] = None
    version_number: Optional[int] = None
    status_id: Optional[int] = None
    parent_form_id: Optional[int] = None
    category_id: Optional[str] = None
    subcategory_id: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class FormResponse(FormBase):
    id: int
    uuid: UUID4
    created_at: datetime
    updated_at: datetime
    last_preview_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class FormSimple(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True

class PaginationInfo(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    items_per_page: int

class FormListItem(BaseModel):
    id: int
    uuid: str
    title: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    subcategory_id: Optional[str] = None
    visibility: Optional[str] = None
    version_number: int
    status: str
    created_by: Optional[int] = None
    created_at: str
    updated_at: Optional[str] = None
    questions_count: int = 0

class FormListResponse(BaseModel):
    items: List[FormListItem]
    pagination: PaginationInfo
    
    
class FormMetadata(BaseModel):
    id: str
    title: str
    description: Optional[str]
    version: str
    status: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None


class FormCategory(BaseModel):
    categoryId: str
    categoryName: Optional[str]
    subcategoryId: str
    subcategoryName: Optional[str]
    display: Optional[str]


class FormVisibility(BaseModel):
    type: Literal["Pública", "Privada", "Restringida"]
    allowAnonymous: bool
    requireInstitutionalEmail: bool
    limitOneResponsePerPerson: bool


class FormTiming(BaseModel):
    deadline: Optional[str]
    time: Optional[str]


class FormRequirements(BaseModel):
    requireSignature: bool


class QuestionOption(BaseModel):
    value: str
    label: str


class QuestionItem(BaseModel):
    id: Optional[str] = None
    label: str


class QuestionBase(BaseModel):
    type: str
    prompt: Optional[str]
    required: bool
    validation: Optional[dict] = None
    options: Optional[List[QuestionOption]] = None
    items: Optional[List[QuestionItem]] = None
    min: Optional[int] = None
    max: Optional[int] = None
    step: Optional[int] = None


class FormQuestion(BaseModel):
    id: str
    order: int
    title: str
    description: Optional[str]
    question: QuestionBase


class FormConfiguration(BaseModel):
    formConfig: dict
    questions: List[FormQuestion]
    signature: Optional[dict] = None
    isLoading: Optional[bool] = None
    error: Optional[str] = None


class FormEngineCreate(BaseModel):
    state: dict
    version: Optional[int] = 0
