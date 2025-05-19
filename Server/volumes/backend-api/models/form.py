from sqlalchemy import String, Integer, Boolean, Date, Time, Enum, ForeignKey, JSON, Text, DateTime, CHAR
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from utils.dbConfig import Base
from typing import Optional

class Form(Base):
    __tablename__ = "forms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    uuid: Mapped[str] = mapped_column(CHAR(36), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category_id: Mapped[Optional[str]] = mapped_column(ForeignKey("categories.id"), nullable=True)
    subcategory_id: Mapped[Optional[str]] = mapped_column(ForeignKey("subcategories.id"), nullable=True)
    visibility: Mapped[str] = mapped_column(Enum("Pública", "Privada", "Restringida"), default="Privada")
    allow_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    require_institutional_email: Mapped[bool] = mapped_column(Boolean, default=False)
    limit_one_response: Mapped[bool] = mapped_column(Boolean, default=False)
    require_signature: Mapped[bool] = mapped_column(Boolean, default=False)
    deadline: Mapped[Optional[Date]] = mapped_column(Date, nullable=True)
    deadline_time: Mapped[Optional[Time]] = mapped_column(Time, nullable=True)
    version_number: Mapped[int] = mapped_column(Integer, default=1)
    parent_form_id: Mapped[Optional[int]] = mapped_column(ForeignKey("forms.id"), nullable=True)
    draft_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    preview_config: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    additional_options: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    status_id: Mapped[int] = mapped_column(ForeignKey("status_types.id"), nullable=False)
    created_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    last_preview_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    start_date: Mapped[Optional[Date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[Date]] = mapped_column(Date, nullable=True)

    # Relaciones
    category = relationship("Category", back_populates="forms")
    subcategory = relationship("Subcategory", back_populates="forms")
    status = relationship("StatusType")
    creator = relationship("User")
    parent_form = relationship("Form", remote_side=[id])
    
    responses = relationship("FormResponse", back_populates="form", cascade="all, delete-orphan")
    questions = relationship("FormQuestion", back_populates="form", cascade="all, delete-orphan")
    permissions = relationship("FormPermission", back_populates="form", cascade="all, delete-orphan")

