# Monroe v2 - Developer Setup Guide

## System Requirements

- Python 3.8+ (recommend 3.10+)
- Node.js 16+ with npm
- PostgreSQL 12+ (optional, SQLite works for dev)
- Git

## Development Environment Setup

### 1. Clone Repository
```bash
git clone <repo-url>
cd monroe-v2
```

### 2. Backend Setup

#### Python Virtual Environment
```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

#### Run Backend
```bash
uvicorn app.main:app --reload
```

Backend available at: `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend available at: `http://localhost:5173`

---

## Database Setup

### Option A: SQLite (Development - Recommended)
No setup needed! SQLite database creates automatically.

```env
DATABASE_URL=sqlite:///./monroe.db
```

### Option B: PostgreSQL (Production)

#### Install PostgreSQL
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql`
- **Linux**: `apt-get install postgresql`

#### Create Database
```bash
# Start PostgreSQL service
# macOS: brew services start postgresql
# Windows: Services - PostgreSQL

# Create database
createdb monroe

# Test connection
psql -U postgres -d monroe
```

#### Update .env
```env
DATABASE_URL=postgresql://postgres:password@localhost/monroe
```

---

## Running the Application

### Option 1: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Monitor Logs:**
```bash
# Watch backend logs
tail -f backend/logs/monroe.log
```

### Option 2: Docker Compose (One Command)
```bash
docker-compose up
```

Access:
- Dashboard: http://localhost:5173
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Common Development Tasks

### Add Python Package
```bash
cd backend
pip install <package-name>
pip freeze > requirements.txt
```

### Add Node Package
```bash
cd frontend
npm install <package-name>
```

### Format Code
```bash
# Backend
cd backend
pip install black
black app/

# Frontend
cd frontend
npm run format  # or: npx prettier --write src/
```

### Run Linter
```bash
# Backend
cd backend
pip install pylint
pylint app/

# Frontend
cd frontend
npm run lint
```

---

## Testing

### Backend Tests
```bash
cd backend
pip install pytest
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000 (backend)
lsof -ti :8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000     # Windows

# Kill process on port 5173 (frontend)
lsof -ti :5173 | xargs kill -9
```

### WebSocket Connection Issues
- Ensure backend is running
- Check firewall settings
- Verify API URL in frontend/src/api.js

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready -h localhost

# Reset database
dropdb monroe
createdb monroe
```

### Module Not Found
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

---

## Git Workflow

### Create Feature Branch
```bash
git checkout -b feature/my-feature
```

### Commit Changes
```bash
git add .
git commit -m "feat: add my feature"
```

### Push to Remote
```bash
git push origin feature/my-feature
```

### Create Pull Request
- Go to GitHub and create PR
- Add description and screenshots
- Request review

---

## IDE Setup

### VS Code
1. Install extensions:
   - Python
   - Pylance
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - REST Client

2. Workspace settings (.vscode/settings.json):
```json
{
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "[python]": {
    "editor.defaultFormatter": "ms-python.python"
  }
}
```

### PyCharm
- Open project
- Create Python interpreter with venv
- Mark `backend/app` as sources root
- Enable JavaScript for frontend

---

## Performance Tips

### Backend
- Use caching for price data
- Connection pooling for database
- Async/await for I/O operations
- Monitor with logging

### Frontend
- Code splitting with React.lazy()
- Memoization with useMemo/useCallback
- Lazy load charts when needed
- Profile with Chrome DevTools

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated
- [ ] API key authentication added
- [ ] CORS properly configured
- [ ] Logging enabled
- [ ] Error handling tested
- [ ] Rate limiting implemented
- [ ] SSL/TLS certificate setup
- [ ] Database backups configured
- [ ] Monitoring alerts setup

---

## Additional Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [WebSocket Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy coding!** 🚀
