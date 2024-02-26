FE_IMAGE_NAME = chin_plus_fe
BE_IMAGE_NAME = chin_plus_be
DOCKER_HUB_REPO = std016039/chin_plus_fe
VERSION = latest
GREEN = \033[0;32m

all: build-front tag push

tag:
	@echo "$(GREEN) Tag $(FE_IMAGE_NAME) with $(VERSION) $(GREEN)"
	docker tag $(FE_IMAGE_NAME):$(VERSION) $(DOCKER_HUB_REPO):$(VERSION)

push:
	@echo "$(GREEN)Push image $(FE_IMAGE_NAME):$(VERSION) $(GREEN)"
	docker push $(DOCKER_HUB_REPO):$(VERSION)

build-front:
	@echo "Build $(FE_IMAGE_NAME) v$(VERSION)"
	docker compose -f build $(FE_IMAGE_NAME)

# commands for production
build-up-back: build-back up-back
# build-up-front: build-front up-front

build-back:
	@echo "Build $(BE_IMAGE_NAME) v$(VERSION)"
	docker compose -f docker-compose.prod.yml build $(BE_IMAGE_NAME)

up-back:
	@echo "Compose UP for backend"
	docker compose -f docker-compose.prod.yml up -d chin_plus_be

up-front:
	@echo "Compose UP for frontend v${VERSION}"
	docker compose -f docker-compose.prod.yml up -d chin_plus_fe