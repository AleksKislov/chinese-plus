FE_IMAGE_NAME = chin_plus_fe
BE_IMAGE_NAME = chin_plus_be
BE_GO_IMAGE_NAME = chin_plus_go_be
DOCKER_HUB_FE_REPO = std016039/chin_plus_fe
DOCKER_HUB_BE_GO_REPO = std016039/chin_plus_go_be
VERSION = latest
GREEN = \033[0;32m

all: build-front tag push

build-front:
	@echo "Build $(FE_IMAGE_NAME) v$(VERSION)"
	docker compose build $(FE_IMAGE_NAME)

tag:
	@echo "$(GREEN) Tag $(FE_IMAGE_NAME) with $(VERSION) $(GREEN)"
	docker tag bylh-$(FE_IMAGE_NAME) $(DOCKER_HUB_FE_REPO):$(VERSION)

push:
	@echo "$(GREEN)Push image $(FE_IMAGE_NAME):$(VERSION) $(GREEN)"
	docker push $(DOCKER_HUB_FE_REPO):$(VERSION)

# for golang books server
prepare-go: build-go tag-go push-go

build-go:
	@echo "Build $(BE_GO_IMAGE_NAME) v$(VERSION)"
	docker compose build $(BE_GO_IMAGE_NAME)

tag-go:
	@echo "$(GREEN) Tag $(BE_GO_IMAGE_NAME) with $(VERSION) $(GREEN)"
	docker tag bylh-$(BE_GO_IMAGE_NAME) $(DOCKER_HUB_BE_GO_REPO):$(VERSION)

push-go:
	@echo "$(GREEN)Push image $(BE_GO_IMAGE_NAME):$(VERSION) $(GREEN)"
	docker push $(DOCKER_HUB_BE_GO_REPO):$(VERSION)

# commands for production
build-up-back: build-back up-back

build-back:
	@echo "Build $(BE_IMAGE_NAME) v$(VERSION)"
	docker compose -f docker-compose.prod.yml build $(BE_IMAGE_NAME)

up-back:
	@echo "Compose UP for backend"
	docker compose -f docker-compose.prod.yml up -d $(BE_IMAGE_NAME)

up-front:
	@echo "Compose UP for frontend v${VERSION}"
	docker compose -f docker-compose.prod.yml up -d $(FE_IMAGE_NAME)

up-go-be:
	@echo "Compose UP for golang server v${VERSION} with the following env variables: db_uri=${MONGO_URI} db_name=${DB_NAME} check_api=${CHECK_WORD_API}"
	docker compose -f docker-compose.prod.yml up -d $(BE_GO_IMAGE_NAME)