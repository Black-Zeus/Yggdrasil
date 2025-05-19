from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import Optional, TYPE_CHECKING
from utils.dbConfig import Base
from datetime import datetime, timezone
import enum

class OperatingSystem(enum.Enum):
    ANDROID = "ANDROID"
    IOS = "IOS"

class Device(Base):
    __tablename__ = "devices"

    id: Mapped[int] = mapped_column("id", Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column("name", String(150), nullable=False)
    brand: Mapped[str] = mapped_column("brand", String(100), nullable=False)
    model: Mapped[str] = mapped_column("model", String(100), nullable=False)
    device_physical_id: Mapped[str] = mapped_column("device_physical_id", String(200), nullable=False, unique=True)
    user_id: Mapped[Optional[int]] = mapped_column("user_id", Integer, ForeignKey("users.id"), nullable=True)
    status_id: Mapped[int] = mapped_column("status_id", Integer, ForeignKey("status_types.id"), nullable=False)
    operating_system: Mapped[OperatingSystem] = mapped_column(
        "operating_system", 
        Enum(OperatingSystem), 
        nullable=False
    )
    register_code: Mapped[str] = mapped_column("register_code", String(36), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(
        "created_at", 
        DateTime, 
        default=datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        "updated_at",
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc)
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        "deleted_at",
        DateTime,
        nullable=True
    )

    # Relaciones
    user = relationship("User", back_populates="devices")
    status = relationship("StatusType", back_populates="devices")