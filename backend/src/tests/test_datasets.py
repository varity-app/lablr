"""
Test datasets
"""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

EXAMPLE_DATASET_BODY = {
    "name": "Unit Test Dataset",
    "description": "Dataset created during a unit test",
    "labels": [
        {
            "name": "Tag Boolean",
            "variant": "boolean",
        },
        {
            "name": "Tag Boolean",
            "variant": "numerical",
            "minimum": -1,
            "maximum": 1,
            "interval": 0.5,
        },
    ],
    "id_field": "id",
    "text_field": "text",
    "csv64": "aWQsdGV4dAoxLHNrZWV0CjIsd2hlYXQK",
}


def test_get_datasets():
    """Unit test for hitting the /datasets endpoint"""

    response = client.get("/datasets")

    assert response.status_code == 200


def test_get_nonexistent_dataset():
    """Unit test for trying to fetch a nonexistent dataset"""

    response = client.get("/datasets/daflkadsjflkajdflkadfadadfadsfad")

    assert response.status_code == 404


def test_create_delete_dataset():
    """Unit test for creating and subsequently deleting a dataset"""

    body = EXAMPLE_DATASET_BODY.copy()

    response = client.post("/datasets", json=body)
    response_body = response.json()

    assert response.status_code == 200
    assert response_body["name"] == "Unit Test Dataset"
    assert response_body["description"] == "Dataset created during a unit test"

    response = client.get(f"/datasets/{response_body['dataset_id']}")
    assert response.status_code == 200

    response = client.delete(f"/datasets/{response_body['dataset_id']}")
    assert response.status_code == 200


def test_create_missing_fields_dataset():
    """Unit test for creating a dataset with missing important fields"""

    for field in ["name", "description", "id_field", "text_field", "csv64"]:
        body = EXAMPLE_DATASET_BODY.copy()
        del body[field]

        response = client.post("/datasets", json=body)
        assert response.status_code != 200


def test_create_invalid_csv64_dataset():
    """Unit test for creating a dataset with an invalid csv64 field"""

    body = EXAMPLE_DATASET_BODY.copy()
    body["csv64"] = "this is not base64 encoded"

    response = client.post("/datasets", json=body)

    assert response.status_code == 400
    assert (
        response.json()["detail"] == "Field csv64 does not have a valid base64 encoding"
    )


def test_delete_nonexistent_dataset():
    """Unit test for trying to delete a nonexistent dataset"""

    response = client.delete("/datasets/daflkadsjflkajdflkadfadadfadsfad")

    assert response.status_code == 404
