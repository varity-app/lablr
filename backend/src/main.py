"""
Entrypoint script for the FastAPI application
"""

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    """Placeholder endpoint"""
    return dict(message="Hello World!")
