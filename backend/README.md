# Backend Application

The backend is built with [FastAPI](https://fastapi.tiangolo.com/) and Python.  The framework was chosen for it's ease of use, performance, and utilization of modern Python features such as static typing.

### Running the dev environment
Start the application with the `make run-backend` command. You should find the API running at [localhost:8000](localhost:8000).

### Linting
The application uses the opinionated `black` linter, as well as `pylint` for additional checks.

You can easily format all python files with the `make black` command, and check for `pylint` errors with `make pylint`.

### Testing
The backend uses `pytest` and FastAPI's built in TestClient for unit testing.  Run the tests with `make pytest`.

### GitHub Actions
There is a GitHub Actions workflow for automatic linting and `pytest` checks that will be run on every push.



