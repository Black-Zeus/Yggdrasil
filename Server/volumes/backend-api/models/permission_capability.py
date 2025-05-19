from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import List, Optional, TYPE_CHECKING
from utils.dbConfig import Base
from datetime import datetime, timezone

if TYPE_CHECKING:
    from .permission_type import PermissionType
    from .permission_type_capability import PermissionTypeCapability

class PermissionCapability(Base):
    __tablename__ = "permission_capabilities"

    id: Mapped[int] = mapped_column("id", Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column("code", String(30), unique=True, nullable=False)
    name: Mapped[str] = mapped_column("name", String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column("description", String, nullable=True)
    created_at: Mapped[datetime] = mapped_column("created_at", DateTime, default=datetime.now(timezone.utc))

    permission_types: Mapped[List["PermissionType"]] = relationship(
        "PermissionType",
        secondary="permission_type_capabilities",
        back_populates="capabilities",
        overlaps="type_capabilities,permission_type"
    )

    type_capabilities: Mapped[List["PermissionTypeCapability"]] = relationship(
        "PermissionTypeCapability",
        back_populates="capability",
        overlaps="permission_types,permission_type"
    )
