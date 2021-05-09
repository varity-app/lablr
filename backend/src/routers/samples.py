"""
Routes related to Dataset objects
"""

from typing import Dict, List, Optional
import logging

from fastapi import APIRouter, Depends
from pydantic import BaseModel  # pylint: disable=no-name-in-module
from sqlalchemy.orm import Session

from database import sample, get_db

router = APIRouter()
logger = logging.getLogger(__name__)


class Sample(BaseModel):
    """Schema for a sample data object"""

    sample_id: str
    original_id: str
    text: str
    labels: Optional[Dict[str, float]]
    save_for_later: bool

    class Config:
        """Pydantic Config subclass"""

        orm_mode = True


class PaginationMetadata(BaseModel):
    """Schema for pagination metadata"""

    offset: int
    limit: int
    next_offset: Optional[int]
    total: int


class Metadata(BaseModel):
    """Schema of the metadata returned with fetching multiple samples"""

    labeled_percent: float
    pagination: PaginationMetadata


class SamplesGet(BaseModel):
    """Schema of the response when fetching multiple samples"""

    samples: List[Sample]
    metadata: Metadata


@router.get(
    "/datasets/{dataset_id}/samples", response_model=SamplesGet, tags=["samples"]
)
def get_samples(
    dataset_id,
    offset: int = 0,
    limit: int = 1,
    labeled: Optional[bool] = None,
    db_session: Session = Depends(get_db),
):
    """Get multiple samples belonging to a dataset"""

    query = db_session.query(sample.Sample).filter_by(dataset_id=dataset_id)

    samples_count = query.count()
    labeled_count = query.filter(sample.Sample.labels.isnot(None)).count()
    labeled_percent = 0
    if samples_count > 0:
        labeled_percent = float(labeled_count) / samples_count

    # Filter by labeled or not
    if labeled is not None:
        if labeled:
            query = query.filter(sample.Sample.labels.isnot(None))
        else:
            query = query.filter_by(labels=None)

    # Pagination Metadata
    total = query.count()
    query = query.offset(offset).offset(limit)

    next_offset = offset + limit
    if next_offset >= total:
        next_offset = None

    pagination = dict(
        limit=limit,
        offset=offset,
        total=total,
        next_offset=next_offset,
    )

    # Metadata
    metadata = dict(
        labeled_percent=labeled_percent,
        pagination=pagination,
    )

    return dict(
        samples=query.all(),
        metadata=metadata,
    )
