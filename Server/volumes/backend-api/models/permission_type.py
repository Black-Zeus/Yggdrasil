from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import List, Optional, TYPE_CHECKING
from utils.dbConfig import Base
from datetime import datetime, timezone

if TYPE_CHECKING:
    from .permission_capability import PermissionCapability, PermissionTypeCapability
    from .form_permission import FormPermission

class PermissionType(Base):
    __tablename__ = "permission_types"

    id: Mapped[int] = mapped_column("id", Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column("code", String(30), unique=True, nullable=False)
    name: Mapped[str] = mapped_column("name", String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column("description", String, nullable=True)
    is_active: Mapped[bool] = mapped_column("is_active", Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column("created_at", DateTime, default=datetime.now(timezone.utc))

    capabilities: Mapped[List["PermissionCapability"]] = relationship(
        "PermissionCapability",
        secondary="permission_type_capabilities",
        back_populates="permission_types",
        overlaps="type_capabilities,capability"
    )

    type_capabilities: Mapped[List["PermissionTypeCapability"]] = relationship(
        "PermissionTypeCapability",
        back_populates="permission_type",
        overlaps="capabilities,capability"
    )

    form_permissions: Mapped[List["FormPermission"]] = relationship(
        "FormPermission",
        back_populates="permission_type"
    )
