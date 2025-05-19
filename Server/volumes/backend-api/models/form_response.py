from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from utils.dbConfig import Base
from typing import Optional

class FormResponse(Base):
    __tablename__ = "form_responses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    form_id: Mapped[int] = mapped_column(ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    response_token: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))
    manual_signature_key: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    signed_by_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    signed_by_email: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    status_id: Mapped[int] = mapped_column(ForeignKey("status_types.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))

    # Relaciones
    form = relationship("Form")
    user = relationship("User")
    status = relationship("StatusType")
    answers = relationship("ResponseAnswer", back_populates="response", cascade="all, delete-orphan")