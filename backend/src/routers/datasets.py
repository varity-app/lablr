"""
Routes related to Dataset objects
"""

from typing import List, Optional
from datetime import datetime
from io import StringIO
import csv
import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel  # pylint: disable=no-name-in-module
from sqlalchemy.orm import Session

from database import dataset, label_definition, sample, get_db
from util.base64 import decode_b64string  # pylint: disable=no-name-in-module
from util.constants import LabelVariants

router = APIRouter()
logger = logging.getLogger(__name__)


class LabelDefinition(BaseModel):
    """Pydantic model for the LabelDefinition data object"""

    name: str
    variant: str
    minimum: Optional[float] = 0
    maximum: Optional[float] = 1
    interval: Optional[float] = 0.5

    class Config:
        """Pydantic Config subclass"""

        orm_mode = True


class Dataset(BaseModel):
    """Base pydantic model for a Dataset data object"""

    name: str
    description: str


class DatasetGet(Dataset):
    """Schema of a response for fetching datasets"""

    dataset_id: int
    created_at: datetime

    class Config:
        """Pydantic Config subclass"""

        orm_mode = True


class DatasetGetOne(DatasetGet):
    """Schema of a response for fetching a single dataset"""

    labels: List[LabelDefinition]

    class Config:
        """Pydantic Config subclass"""

        orm_mode = True


class DatasetCreate(Dataset):
    """Schema of request body for creating a dataset"""

    id_field: str
    text_field: str
    labels: List[LabelDefinition]
    csv64: str  # Base64 encoded string of the CSV that forms the upload


@router.get("/datasets", response_model=List[DatasetGet], tags=["datasets"])
async def get_datasets(db_session: Session = Depends(get_db)):
    """Get all datasets"""

    return db_session.query(dataset.Dataset).all()


@router.get("/datasets/{dataset_id}", response_model=DatasetGetOne, tags=["datasets"])
async def get_dataset(dataset_id, db_session: Session = Depends(get_db)):
    """Get one dataset"""

    db_dataset = (
        db_session.query(dataset.Dataset).filter_by(dataset_id=dataset_id).first()
    )

    if db_dataset is None:
        raise HTTPException(
            status_code=404, detail=f"No dataset found with id `{dataset_id}`"
        )

    _ = db_dataset.labels  # Results in `labels` field appearing in response

    return db_dataset


@router.delete("/datasets/{dataset_id}", tags=["datasets"])
async def delete_dataset(dataset_id, db_session: Session = Depends(get_db)):
    """Delete a dataset and its dependent label definitions and samples"""

    # Fetch dataset
    db_dataset = (
        db_session.query(dataset.Dataset).filter_by(dataset_id=dataset_id).first()
    )

    if db_dataset is None:
        raise HTTPException(
            status_code=404, detail=f"No dataset found with id `{dataset_id}`"
        )

    # Delete label definitions
    for label in db_dataset.labels:
        db_session.delete(label)

    # Delete samples
    for db_sample in db_dataset.samples:
        db_session.delete(db_sample)

    # Delete dataset
    db_session.delete(db_dataset)

    db_session.commit()

    return f"Successfully deleted dataset with id `{dataset_id}`"


@router.post("/datasets", response_model=DatasetGet, tags=["datasets"])
async def create_dataset(data: DatasetCreate, db_session: Session = Depends(get_db)):
    """Create a dataset and its dependent label definitions and samples"""

    # Create dataset object
    db_dataset = dataset.Dataset(
        name=data.name,
        description=data.description,
        created_at=datetime.now(),
    )
    db_session.add(db_dataset)
    db_session.commit()

    # Create label definitions
    for label in data.labels:
        if label.variant not in LabelVariants.valid_labels:
            db_session.delete(db_dataset)
            db_session.commit()
            raise HTTPException(
                status_code=422,
                detail=f"Variant `{label.variant}` for label `{label.name}` "
                f"must be one of {LabelVariants.valid_labels}",
            )

        db_label = label_definition.LabelDefinition(
            dataset_id=db_dataset.dataset_id,
            name=label.name,
            variant=label.variant,
            minimum=label.minimum,
            maximum=label.maximum,
            interval=label.interval,
        )
        db_session.add(db_label)

    # Decode csv64 field
    try:
        csv_string = decode_b64string(data.csv64)
    except ValueError as error:
        db_session.delete(db_dataset)
        db_session.commit()
        raise HTTPException(
            status_code=422, detail="Field csv64 does not have a valid base64 encoding"
        ) from error

    # Read CSV
    csv_f = StringIO(csv_string)
    reader = csv.DictReader(csv_f, delimiter=",")

    # Check that id and text fields are valid
    for field in (data.id_field, data.text_field):
        if field not in reader.fieldnames:
            db_session.delete(db_dataset)
            db_session.commit()
            raise HTTPException(
                status_code=422, detail=f"Field {field} not found in provided CSV"
            )

    # Create samples in DB
    for row in reader:
        db_sample = sample.Sample(
            dataset_id=db_dataset.dataset_id,
            original_id=row[data.id_field],
            text=row[data.text_field],
        )
        db_session.add(db_sample)

    db_session.commit()
    db_session.refresh(db_dataset)

    return db_dataset


@router.get(
    "/datasets/{dataset_id}/export", response_class=PlainTextResponse, tags=["datasets"]
)
def export_labels(dataset_id, db_session: Session = Depends(get_db)):
    """Export a dataset's labels in CSV format"""

    db_dataset = (
        db_session.query(dataset.Dataset).filter_by(dataset_id=dataset_id).first()
    )

    if db_dataset is None:
        raise HTTPException(
            status_code=404, detail=f"No dataset found with id `{dataset_id}`"
        )

    output = StringIO()

    label_names = ["id"]
    for label in db_dataset.labels:
        label_names.append(label.name)

    writer = csv.DictWriter(output, label_names)
    writer.writeheader()

    for db_sample in db_dataset.samples:
        if db_sample.labels is None:
            continue

        body = dict(
            id=db_sample.original_id,
            **db_sample.labels,
        )
        print(body)
        writer.writerow(body)

    return output.getvalue()
