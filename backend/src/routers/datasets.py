"""
Routes related to Dataset objects
"""

from typing import List, Optional
from datetime import datetime
from io import StringIO
import csv
import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel  # pylint: disable=no-name-in-module
from sqlalchemy.orm import Session

from database import dataset, label_definition, sample, get_db
from util.base64 import decode_b64string  # pylint: disable=no-name-in-module

router = APIRouter()
logger = logging.getLogger(__name__)


class LabelDefinition(BaseModel):
    """Pydantic model for the LabelDefinition data object"""

    name: str
    variant: str
    minimum: Optional[float] = 0
    maximum: Optional[float] = 1
    interval: Optional[float] = 0.5


class DatasetCreate(BaseModel):
    """Schema of request body for creating a dataset"""

    name: str
    description: str
    labels: List[LabelDefinition]
    id_field: str
    text_field: str
    csv64: str  # Base64 encoded string of the CSV that forms the upload


@router.get("/datasets", tags=["datasets"])
async def get_datasets(db_session: Session = Depends(get_db)):
    """Get all datasets"""

    return db_session.query(dataset.Dataset).all()


@router.post("/datasets", tags=["datasets"])
async def create_dataset(data: DatasetCreate, db_session: Session = Depends(get_db)):
    """Create a dataset"""

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
        raise HTTPException(
            status_code=400, detail="Field csv64 does not have a valid base64 encoding"
        ) from error

    # Read CSV
    csv_f = StringIO(csv_string)
    reader = csv.DictReader(csv_f, delimiter=",")

    # Check that id and text fields are valid
    for field in (data.id_field, data.text_field):
        if field not in reader.fieldnames:
            raise HTTPException(
                status_code=400, detail=f"Field {field} not found in provided CSV"
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
