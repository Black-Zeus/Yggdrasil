from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import List, Optional, TYPE_CHECKING
from utils.dbConfig import Base
from datetime import datetime, timezone

if TYPE_CHECKING:
    from .subcategory import Subcategory
    from .form import Form

class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column("id", String(50), primary_key=True)
    name: Mapped[str] = mapped_column("name", String(150), nullable=False)
    description: Mapped[Optional[str]] = mapped_column("description", String, nullable=True)
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

    # Relaciones
    subcategories: Mapped[List["Subcategory"]] = relationship(
        "Subcategory",
        back_populates="category",
        cascade="all, delete-orphan"
    )

    forms: Mapped[List["Form"]] = relationship(
        "Form",
        back_populates="category"
    )