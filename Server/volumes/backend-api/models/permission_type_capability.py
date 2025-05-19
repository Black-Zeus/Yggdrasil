from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from utils.dbConfig import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .permission_type import PermissionType
    from .permission_capability import PermissionCapability

class PermissionTypeCapability(Base):
    __tablename__ = "permission_type_capabilities"

    permission_type_id: Mapped[int] = mapped_column(
        "permission_type_id", Integer, ForeignKey("permission_types.id", ondelete="CASCADE"), primary_key=True
    )
    capability_id: Mapped[int] = mapped_column(
        "capability_id", Integer, ForeignKey("permission_capabilities.id", ondelete="CASCADE"), primary_key=True
    )
    value: Mapped[str] = mapped_column("value", String(20), nullable=False)

    permission_type: Mapped["PermissionType"] = relationship(
        "PermissionType",
        back_populates="type_capabilities",
        overlaps="capabilities,permission_types"
    )

    capability: Mapped["PermissionCapability"] = relationship(
        "PermissionCapability",
        back_populates="type_capabilities",
        overlaps="capabilities,permission_types"
    )
