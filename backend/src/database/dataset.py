"""
Declare the SQLAlchemy model for the Dataset data object
"""

from sqlalchemy import Column, Integer, String, DateTime

from . import Base


class Dataset(Base):
    """SQLAlchemy model for the Dataset data object"""

    __tablename__ = "datasets"

    dataset_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    created_at = Column(DateTime)
