"""
Declare the SQLAlchemy model for the LabelDefinition data object
"""

from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship

from . import Base


class LabelDefinition(Base):
    """SQLAlchemy model for the LabelDefinition data object"""

    __tablename__ = "label_definitions"

    label_definition_id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.dataset_id"))

    name = Column(String)
    variant = Column(String)

    # Numerical variant-specific fields
    minimum = Column(Float, default=0.0)
    maximum = Column(Float, default=1.0)
    interval = Column(Float, default=0.5)

    dataset = relationship("Dataset", back_populates="labels")
