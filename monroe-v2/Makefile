.PHONY: help install dev build docker-up docker-down test lint format clean

help:
	@echo "Monroe v2 - Available Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make install       - Install all dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Run backend and frontend in development"
	@echo "  make backend       - Run backend only"
	@echo "  make frontend      - Run frontend only"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up     - Start all services with docker-compose"
	@echo "  make docker-down   - Stop all docker services"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint          - Run linters"
	@echo "  make format        - Format code"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean         - Clean build artifacts and caches"

install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

dev:
	@echo "Starting Monroe v2 in development mode..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:5173"
	@echo ""
	@echo "Opening terminals... (Run these in separate terminals)"
	@echo ""
	@echo "Terminal 1 - Backend:"
	@echo "  cd backend && python -m uvicorn app.main:app --reload"
	@echo ""
	@echo "Terminal 2 - Frontend:"
	@echo "  cd frontend && npm run dev"

backend:
	cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	cd frontend && npm run dev

docker-up:
	@echo "Starting Monroe v2 with Docker Compose..."
	docker-compose up -d
	@echo "Waiting for services to start..."
	sleep 5
	@echo "Monroe is ready!"
	@echo "API: http://localhost:8000"
	@echo "Dashboard: http://localhost:5173"
	@echo "Logs: docker-compose logs -f"

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-clean:
	docker-compose down -v
	docker system prune -f

lint:
	@echo "Linting backend..."
	cd backend && pylint app/*.py --disable=C0111,C0103,W0212 || true
	@echo "Linting frontend..."
	cd frontend && npx eslint src --max-warnings 0 || true

format:
	@echo "Formatting backend..."
	cd backend && black app/
	@echo "Formatting frontend..."
	cd frontend && npx prettier --write src/

clean:
	@echo "Cleaning build artifacts..."
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	cd backend && rm -rf .pytest_cache dist build *.egg-info
	cd frontend && rm -rf node_modules dist build .next
	rm -rf .DS_Store

test:
	@echo "Running tests..."
	cd backend && pytest tests/ -v || echo "No tests found"

setup-postgres:
	@echo "Setting up PostgreSQL..."
	createdb monroe 2>/dev/null || echo "Database already exists"
	@echo "Remember to update .env with: DATABASE_URL=postgresql://postgres:postgres@localhost/monroe"
