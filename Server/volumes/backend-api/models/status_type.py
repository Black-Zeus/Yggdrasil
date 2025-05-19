from sqlalchemy import String, Integer, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from utils.dbConfig import Base
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import relationship
from models.user import User  # si se necesita para evitar errores en autocompletado o circularidad controlada

class StatusType(Base):
    __tablename__ = "status_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(30), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))

    # 👇 Relación con usuarios
    users = relationship("User", back_populates="status")
    devices = relationship("Device", back_populates="status")

