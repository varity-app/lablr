.PHONY: build

GIT_BRANCH = $$(git symbolic-ref --short HEAD)
DOCKER_UP = "docker-compose up"
DOCKER_DOWN = "docker-compose down"
DOCKER_RUN = "docker-compose run"

.EXPORT_ALL_VARIABLES:

.DEFAULT: help
help:
	@echo "\n \
	------------------------------ \n \
	++ Python Related ++ \n \
	black: Runs a linter (Black) over the whole repo. \n \
	mypy: Runs a type-checker in the extract dir. \n \
	pylint: Runs the pylint checker over the whole repo. \n \
	pytest: Unit tests with the pytest python module. \n \
	radon: Runs a cyclomatic complexity checker and shows anything with less than an A rating. \n \
	xenon: Runs a cyclomatic complexity checker that will throw a non-zero exit code if the criteria aren't met. \n \
	++ Custom ++ \n \
	run-backend: Run a development version of the backend. \n \
	------------------------------ \n"

black:
	@echo "Linting the repo..."
	@black backend/src

mypy:
	@echo "Running mypy..."
	@mypy backend/ --ignore-missing-imports

pylint:
	@echo "Running pylint..."
	@cd backend && pylint src

pytest:
	@echo "Running pytest..."
	@cd backend && python -m pytest src --disable-pytest-warnings

radon:
	@echo "Run Radon to compute complexity..."
	@radon cc backend --total-average -nb

xenon:
	@echo "Running Xenon..."
	@xenon --max-absolute B --max-modules A --max-average A src -i transform,shared_modules

run-backend:
	@echo "Running development version of backend..."
	@cd backend/src && uvicorn main:app --reload