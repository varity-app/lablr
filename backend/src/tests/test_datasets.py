"""
Test datasets
"""

from fastapi.testclient import TestClient

from main import app, PREFIX

client = TestClient(app)

EXAMPLE_DATASET_BODY = {
    "name": "Unit Test Dataset",
    "description": "Dataset created during a unit test",
    "labels": [
        {
            "name": "Boolean",
            "variant": "boolean",
        },
        {
            "name": "Numerical",
            "variant": "numerical",
            "minimum": -1,
            "maximum": 1,
            "interval": 0.5,
        },
    ],
}


def test_get_datasets():
    """Unit test for hitting the /datasets endpoint"""

    response = client.get(f"{PREFIX}/datasets")

    assert response.status_code == 200


def test_get_nonexistent_dataset():
    """Unit test for trying to fetch a nonexistent dataset"""

    response = client.get(f"{PREFIX}/datasets/daflkadsjflkajdflkadfadadfadsfad")

    assert response.status_code == 404


def test_create_delete_dataset():
    """Unit test for creating and subsequently deleting a dataset"""

    body = EXAMPLE_DATASET_BODY.copy()

    response = client.post(f"{PREFIX}/datasets", json=body)
    response_body = response.json()
    dataset_id = response_body["dataset_id"]

    assert response.status_code == 200
    assert response_body["name"] == "Unit Test Dataset"
    assert response_body["description"] == "Dataset created during a unit test"

    response = client.get(f"{PREFIX}/datasets/{dataset_id}")
    assert response.status_code == 200

    response = client.delete(f"{PREFIX}/datasets/{dataset_id}")
    assert response.status_code == 200


def test_create_missing_fields_dataset():
    """Unit test for creating a dataset with missing important fields"""

    for field in ["name", "description", "labels"]:
        body = EXAMPLE_DATASET_BODY.copy()
        del body[field]

        response = client.post(f"{PREFIX}/datasets", json=body)
        assert response.status_code == 422


def test_delete_nonexistent_dataset():
    """Unit test for trying to delete a nonexistent dataset"""

    response = client.delete(f"{PREFIX}/datasets/daflkadsjflkajdflkadfadadfadsfad")

    assert response.status_code == 404
