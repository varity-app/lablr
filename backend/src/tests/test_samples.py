"""
Test samples endpoints
"""

import os

from fastapi.testclient import TestClient

from main import app, PREFIX

from .test_datasets import EXAMPLE_DATASET_BODY

client = TestClient(app)

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))


def create_demo_dataset() -> int:
    """Helper method that creates a dataset with default samples"""

    body = EXAMPLE_DATASET_BODY.copy()

    # Create dataset
    response = client.post(f"{PREFIX}/datasets", json=body)
    assert response.status_code == 200

    dataset_id = response.json()["dataset_id"]

    # Create samples
    data = dict(id_field="id", text_field="text")
    files = dict(
        file=("test.csv", open(f"{SCRIPT_DIR}/test_samples.csv", "rb"), "text/csv")
    )

    response = client.post(
        f"{PREFIX}/datasets/{dataset_id}/samples", data=data, files=files
    )

    assert response.status_code == 200

    return dataset_id


def delete_demo_dataset(dataset_id: int) -> None:
    """Helper method that destroys the demo dataset"""

    response = client.delete(f"{PREFIX}/datasets/{dataset_id}")
    assert response.status_code == 200


def test_create_invalid_samples():
    """Unit test for attempting to create invalid samples"""

    dataset_id = create_demo_dataset()

    # Invalid fields
    data = dict(id_field="id_no_existo", text_field="text")
    files = dict(
        file=("test.csv", open(f"{SCRIPT_DIR}/test_samples.csv", "rb"), "text/csv")
    )

    response = client.post(
        f"{PREFIX}/datasets/{dataset_id}/samples", data=data, files=files
    )

    assert response.status_code == 422

    data = dict(id_field="id", text_field="text_no_existo")
    files = dict(
        file=("test.csv", open(f"{SCRIPT_DIR}/test_samples.csv", "rb"), "text/csv")
    )

    response = client.post(
        f"{PREFIX}/datasets/{dataset_id}/samples", data=data, files=files
    )

    assert response.status_code == 422


def test_samples_create():
    """Unit test for creating a new dataset and uploading new samples"""

    dataset_id = create_demo_dataset()

    delete_demo_dataset(dataset_id)


def test_samples_get():
    """Unit test for creating a new dataset and fetching its samples"""

    dataset_id = create_demo_dataset()

    # Fetch samples
    response = client.get(f"{PREFIX}/datasets/{dataset_id}/samples")
    assert response.status_code == 200

    delete_demo_dataset(dataset_id)


def test_sample_get():
    """Unit test for creating a new dataset and fetching a single sample"""

    dataset_id = create_demo_dataset()

    # Fetch samples
    response = client.get(f"{PREFIX}/datasets/{dataset_id}/samples")
    assert response.status_code == 200

    sample_id = response.json()["samples"][0]["sample_id"]

    response = client.get(f"{PREFIX}/datasets/{dataset_id}/samples/{sample_id}")
    assert response.status_code == 200

    delete_demo_dataset(dataset_id)


def test_label_sample():
    """Unit test for creating a new dataset and labeling its samples"""

    dataset_id = create_demo_dataset()

    # Fetch samples
    response = client.get(f"{PREFIX}/datasets/{dataset_id}/samples")
    assert response.status_code == 200

    sample_id = response.json()["samples"][0]["sample_id"]

    # Label sample
    body = {
        "labels": {
            "Boolean": 1,
            "Numerical": 0.5,
        }
    }
    response = client.put(
        f"{PREFIX}/datasets/{dataset_id}/samples/{sample_id}", json=body
    )
    print(response.json())

    assert response.status_code == 200

    body = {
        "labels": {
            "Boolean": 0,
            "Numerical": 0,
        }
    }
    response = client.put(
        f"{PREFIX}/datasets/{dataset_id}/samples/{sample_id}", json=body
    )
    print(response.json())

    assert response.status_code == 200

    delete_demo_dataset(dataset_id)


def test_label_sample_invalid_numerical():
    """Unit test for attempting to label a sample with an invalid numerical label"""

    dataset_id = create_demo_dataset()

    # Fetch samples
    response = client.get(f"{PREFIX}/datasets/{dataset_id}/samples")
    assert response.status_code == 200

    sample_id = response.json()["samples"][0]["sample_id"]

    # Too low
    body = {
        "labels": {
            "Numerical": -10,
        }
    }
    response = client.put(
        f"{PREFIX}/datasets/{dataset_id}/samples/{sample_id}", json=body
    )
    print(response.json())

    assert response.status_code == 422

    # Too high
    body = {
        "labels": {
            "Numerical": 10,
        }
    }
    response = client.put(
        f"{PREFIX}/datasets/{dataset_id}/samples/{sample_id}", json=body
    )
    print(response.json())

    assert response.status_code == 422

    delete_demo_dataset(dataset_id)


def test_label_sample_invalid_boolean():
    """Unit test for attempting to label a sample with an invalid boolean label"""

    dataset_id = create_demo_dataset()

    # Fetch samples
    response = client.get(f"{PREFIX}/datasets/{dataset_id}/samples")
    assert response.status_code == 200

    sample_id = response.json()["samples"][0]["sample_id"]

    # Label sample
    body = {
        "labels": {
            "Boolean": 0.5,
        }
    }
    response = client.put(
        f"{PREFIX}/datasets/{dataset_id}/samples/{sample_id}", json=body
    )
    print(response.json())

    assert response.status_code == 422

    delete_demo_dataset(dataset_id)


def test_export_labels():
    """Unit test for exporting a dataset's labels"""

    dataset_id = create_demo_dataset()

    # Fetch samples
    response = client.get(f"{PREFIX}/datasets/{dataset_id}/samples")
    assert response.status_code == 200

    sample_id = response.json()["samples"][0]["sample_id"]

    # Label sample
    body = {
        "labels": {
            "Boolean": 1,
        }
    }
    response = client.put(
        f"{PREFIX}/datasets/{dataset_id}/samples/{sample_id}", json=body
    )
    print(response.json())

    assert response.status_code == 200

    response = client.get(f"{PREFIX}/datasets/{dataset_id}")
    assert response.status_code == 200

    delete_demo_dataset(dataset_id)
