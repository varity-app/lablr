"""
Declare the SQLAlchemy model for the Sample data object
"""

from sqlalchemy import Column, Integer, String, ForeignKey

from . import Base


class Sample(Base):
    """SQLAlchemy model for the Sample data object"""

    __tablename__ = "samples"

    sample_id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.dataset_id"))

    original_id = Column(String)
    text = Column(String)
