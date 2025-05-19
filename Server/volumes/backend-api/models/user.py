# user.py
from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from utils.dbConfig import Base
from typing import Optional, List

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False, unique=True)
    institutional_email: Mapped[Optional[str]] = mapped_column(String(150), nullable=True, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    secret_key: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status_id: Mapped[int] = mapped_column(ForeignKey("status_types.id"), nullable=False)
    email_verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
     
    # Relaciones
    status = relationship("StatusType", back_populates="users")

    roles = relationship(
        "Role",
        secondary="user_roles",
        back_populates="users",
        overlaps="user_roles,role_users"
    )

    user_roles = relationship(
        "UserRole",
        back_populates="user",
        overlaps="roles"
    )

    form_permissions = relationship(
        "FormPermission",
        back_populates="user",
        foreign_keys="[FormPermission.user_id]",
        overlaps="granter"
    )

    granted_permissions = relationship(
        "FormPermission",
        back_populates="granter",
        foreign_keys="[FormPermission.granted_by]",
        overlaps="form_permissions"
    )
    
    devices = relationship("Device", back_populates="user")