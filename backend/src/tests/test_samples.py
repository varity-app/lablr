"""
Test samples endpoints
"""

from fastapi.testclient import TestClient

from main import app

from .test_datasets import EXAMPLE_DATASET_BODY

client = TestClient(app)


def test_samples_get():
    """Unit test for creating a new dataset and fetching its samples"""

    body = EXAMPLE_DATASET_BODY.copy()

    response = client.post("/datasets", json=body)
    dataset_id = response.json()["dataset_id"]

    assert response.status_code == 200

    response = client.get(f"/datasets/{dataset_id}/samples")
    assert response.status_code == 200

    response = client.delete(f"/datasets/{dataset_id}")
    assert response.status_code == 200
