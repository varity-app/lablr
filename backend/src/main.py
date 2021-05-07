"""
Entrypoint script for the FastAPI application
"""

import os

from fastapi import FastAPI

from routers import datasets
from database import engine, Base

LABLR_DIR = f"{os.environ.get('HOME')}/.lablr"
if not os.path.exists(LABLR_DIR):
    os.makedirs(LABLR_DIR)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(datasets.router)


@app.get("/")
async def root():
    """Placeholder endpoint"""
    return dict(message="Hello World!")
