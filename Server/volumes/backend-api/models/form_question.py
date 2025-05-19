from sqlalchemy import Integer, String, Text, Boolean, Enum, JSON, DateTime, ForeignKey, SmallInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from utils.dbConfig import Base
from typing import Optional

class FormQuestion(Base):
    __tablename__ = "form_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    form_id: Mapped[int] = mapped_column(ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    question_uid: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    order: Mapped[int] = mapped_column("order", SmallInteger, default=0, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    type: Mapped[str] = mapped_column(Enum(
        "text", "textarea", "dropdown", "single_choice", "multiple_choice",
        "matrix", "ranking", "range"
    ), nullable=False)
    prompt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_required: Mapped[bool] = mapped_column(Boolean, default=False)
    validation: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    extra_config: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    status_id: Mapped[int] = mapped_column(ForeignKey("status_types.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relaciones
    form = relationship("Form", back_populates="questions")
    status = relationship("StatusType")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")
    items = relationship("QuestionItem", back_populates="question", cascade="all, delete-orphan")
