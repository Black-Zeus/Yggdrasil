from sqlalchemy import Integer, Boolean, ForeignKey, DateTime, SmallInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from utils.dbConfig import Base
from typing import Optional

class FormPermission(Base):
    __tablename__ = "form_permissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    form_id: Mapped[int] = mapped_column(ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    role_id: Mapped[Optional[int]] = mapped_column(ForeignKey("roles.id", ondelete="CASCADE"), nullable=True)
    permission_type_id: Mapped[int] = mapped_column(ForeignKey("permission_types.id"), nullable=False)
    granted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    granted_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relaciones
    form = relationship("Form", back_populates="permissions")
    #user = relationship("User", foreign_keys=[user_id], back_populates="form_permissions")
    role = relationship("Role", back_populates="form_permissions")
    permission_type = relationship("PermissionType", back_populates="form_permissions")
    #granter = relationship("User", foreign_keys=[granted_by])
    user = relationship("User", foreign_keys=[user_id], back_populates="form_permissions")
    granter = relationship("User", foreign_keys=[granted_by], back_populates="granted_permissions")
