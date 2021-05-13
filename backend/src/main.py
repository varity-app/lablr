"""
Entrypoint script for the FastAPI application
"""

import os

from fastapi import FastAPI

from routers import datasets, samples
from database import engine, Base

LABLR_DIR = f"{os.environ.get('HOME')}/.lablr"
if not os.path.exists(LABLR_DIR):
    os.makedirs(LABLR_DIR)

Base.metadata.create_all(bind=engine)

PREFIX = "/api/v1"

app = FastAPI(
    title="Lablr Backend",
    description="Backend for the Lablr annotation tool",
    version="0.0.0",
    docs_url=f"{PREFIX}/docs",
    openapi_url=f"{PREFIX}/openapi.json",
)

app.include_router(datasets.router, prefix=PREFIX)
app.include_router(samples.router, prefix=PREFIX)
