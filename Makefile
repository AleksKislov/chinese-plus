IMAGE_NAME = chin_plus_fe
DOCKER_HUB_REPO = std016039/chin_plus_fe
VERSION = latest
GREEN = \033[0;32m

all: build-front tag push

build-front:
	@echo "Build $(IMAGE_NAME) v$(VERSION)"
	docker compose build $(IMAGE_NAME)

tag:
	@echo "$(GREEN) Tag $(IMAGE_NAME) with $(VERSION) $(GREEN)"
	docker tag bylh_$(IMAGE_NAME) $(DOCKER_HUB_REPO):$(VERSION)

push:
	@echo "$(GREEN)Push image $(IMAGE_NAME):$(VERSION) $(GREEN)"
	docker push $(DOCKER_HUB_REPO):$(VERSION)

# commands for production
up-back:
	@echo "Compose UP for backend"
	docker compose -f docker-compose.prod.yml up -d chin_plus_be

up-front:
	@echo "Compose UP for frontend v${VERSION}"
	docker compose -f docker-compose.prod.yml up -d chin_plus_fe