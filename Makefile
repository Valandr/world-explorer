.PHONY: dev dev-build dev-down prod prod-build prod-down logs logs-server logs-client clean

# Development
dev:
	docker compose up

dev-build:
	docker compose up --build

dev-down:
	docker compose down

# Production
prod:
	docker compose -f docker-compose.prod.yml up

prod-build:
	docker compose -f docker-compose.prod.yml up --build

prod-down:
	docker compose -f docker-compose.prod.yml down

# Logs
logs:
	docker compose logs -f

logs-server:
	docker compose logs -f server

logs-client:
	docker compose logs -f client

# Cleanup
clean:
	docker compose down --rmi local --volumes
	docker compose -f docker-compose.prod.yml down --rmi local --volumes
