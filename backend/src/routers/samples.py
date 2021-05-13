"""
Routes related to Dataset objects
"""

from typing import Dict, List, Optional
from io import StringIO
import logging
import csv

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from pydantic import BaseModel  # pylint: disable=no-name-in-module
from sqlalchemy.orm import Session

from database import dataset, sample, label_definition, get_db
from util.constants import LabelVariants

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
    query = query.offset(offset).limit(limit)

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


@router.get(
    "/datasets/{dataset_id}/samples/{sample_id}",
    response_model=Sample,
    tags=["samples"],
)
async def get_one_sample(dataset_id, sample_id, db_session: Session = Depends(get_db)):
    """Get a single sample"""
    db_sample = (
        db_session.query(sample.Sample)
        .filter_by(sample_id=sample_id, dataset_id=dataset_id)
        .first()
    )

    if db_sample is None:
        raise HTTPException(
            status_code=404, detail=f"No sample found with id `{sample_id}`"
        )

    return db_sample


class SamplePut(BaseModel):
    """Schema of the request body for updating (labeling) a sample"""

    labels: Dict[str, float]


@router.put("/datasets/{dataset_id}/samples/{sample_id}", tags=["samples"])
async def label_sample(
    data: SamplePut, dataset_id, sample_id, db_session: Session = Depends(get_db)
):
    """Label a sample"""

    db_labels = (
        db_session.query(label_definition.LabelDefinition)
        .filter_by(dataset_id=dataset_id)
        .all()
    )

    # Validate labels
    for label, value in data.labels.items():

        # Check that label is valid for a dataset
        label_def = None
        for db_label in db_labels:
            if label == db_label.name:
                label_def = db_label

        if label_def is None:
            raise HTTPException(
                status_code=422,
                detail=f"Label `{label}` is not a valid label for dataset with dataset_id `{dataset_id}`",
            )

        # Check if numerical label is within valid bounds
        if (
            label_def.variant == LabelVariants.NUMERICAL
            and not label_def.minimum <= value <= label_def.maximum
        ):
            raise HTTPException(
                status_code=422,
                detail=f"Value `{value}` of label `{label}` "
                f"must be within range ({label_def.minimum}, {label_def.maximum}).",
            )

        # Check if boolean variable is either 0 or 1
        if label_def.variant == LabelVariants.BOOLEAN and value not in (0, 1):
            raise HTTPException(
                status_code=422,
                detail=f"Value `{value}` of label `{label}` must be either 0 or 1.",
            )

    # Get and update sample
    db_sample = (
        db_session.query(sample.Sample)
        .filter_by(sample_id=sample_id, dataset_id=dataset_id)
        .first()
    )

    if db_sample is None:
        raise HTTPException(
            status_code=404, detail=f"No sample found with id `{sample_id}`"
        )

    db_sample.labels = data.labels
    db_session.commit()

    return dict()


@router.post("/datasets/{dataset_id}/samples", tags=["samples"])
async def create_samples(
    dataset_id,
    id_field: str = Form(...),
    text_field: str = Form(...),
    file: UploadFile = File(...),
    db_session: Session = Depends(get_db),
):
    """Create samples for a given dataset from a CSV file upload."""

    # Fetch dataset
    db_dataset = (
        db_session.query(dataset.Dataset).filter_by(dataset_id=dataset_id).first()
    )

    if db_dataset is None:
        raise HTTPException(
            status_code=404, detail=f"No dataset found with id `{dataset_id}`"
        )

    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=422, detail="File provided is not in .csv format."
        )

    # Read CSV
    contents = await file.read()
    contents = StringIO(contents.decode("utf-8"))
    reader = csv.DictReader(contents, delimiter=",")

    # Check that id and text fields are valid
    for field in (id_field, text_field):
        if field not in reader.fieldnames:
            raise HTTPException(
                status_code=422,
                detail=f"Field `{field}` not found in provided CSV.  Must be one of {reader.fieldnames}",
            )

    # Create samples in DB
    sample_count = 0
    for row in reader:
        db_sample = sample.Sample(
            dataset_id=db_dataset.dataset_id,
            original_id=row[id_field],
            text=row[text_field],
        )
        db_session.add(db_sample)
        sample_count += 1

    db_session.commit()

    return f"Successfully created {sample_count} samples."
