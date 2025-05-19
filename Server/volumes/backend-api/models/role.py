from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import List, Optional, TYPE_CHECKING
from utils.dbConfig import Base
from datetime import datetime, timezone

if TYPE_CHECKING:
    from .user import User
    from .user_role import UserRole
    from .form_permission import FormPermission

class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column("id", Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column("code", String(30), unique=True, nullable=False)
    name: Mapped[str] = mapped_column("name", String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column("description", String, nullable=True)
    created_at: Mapped[datetime] = mapped_column("created_at", DateTime, default=datetime.now(timezone.utc))

    # Relaciones
    users: Mapped[List["User"]] = relationship(
        "User",
        secondary="user_roles",
        back_populates="roles",
        overlaps="user_roles,role_users"
    )

    user_roles: Mapped[List["UserRole"]] = relationship(
        "UserRole",
        back_populates="role",
        overlaps="users"
    )

    form_permissions: Mapped[List["FormPermission"]] = relationship(
        "FormPermission",
        back_populates="role"
    )