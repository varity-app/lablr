"""
Routes related to Dataset objects
"""

from typing import List, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel  # pylint: disable=no-name-in-module
from sqlalchemy.orm import Session

from database import sample, get_db

router = APIRouter()


class Sample(BaseModel):
    """Schema for a sample data object"""

    sample_id: str
    original_id: str
    text: str
    labels: Dict[str, float]
    save_for_later: bool


@router.get("/datasets/{dataset_id}/samples", tags=["samples"])
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
    labeled_count = query.filter(sample.Sample is not None).count()
    labeled_percent = 0
    if samples_count > 0:
        labeled_percent = float(labeled_count) / samples_count

    # Filter by labeled or not
    if labeled is not None:
        if labeled:
            query = query.filter(sample.Sample is not None)
        else:
            query = query.filter(sample.Sample is None)

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
