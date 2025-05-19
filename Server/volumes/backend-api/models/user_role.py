# user_role.py
from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from utils.dbConfig import Base

class UserRole(Base):
    __tablename__ = "user_roles"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), primary_key=True)

    # Relaciones
    user = relationship("User", back_populates="user_roles", overlaps="roles,users")
    role = relationship("Role", back_populates="user_roles", overlaps="roles,users")