# Monroe v2 — US Equities with Alpaca

A minimal production-style split monorepo using React + FastAPI + PostgreSQL.

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Update .env with your database connection
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Features

- FastAPI backend with PostgreSQL trade journal
- React dashboard with real-time market data
- Alpaca integration for live price feeds
- Monroe trading strategy (volatility-based entry signals)
- CORS enabled for local development
- 5-second polling for price updates

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost/monroe
SYMBOL=AAPL
```

## API Endpoints

- `GET /api/dashboard` - Returns current Monroe signal with price data

## Project Structure

```
monroe-v2/
  backend/
    app/
      main.py          # FastAPI app entry point
      db.py            # SQLAlchemy database setup
      models.py        # Trade model
      schemas.py       # Pydantic schemas
      alpaca_client.py # Price fetching
      strategy.py      # Monroe trading logic
      routes.py        # API endpoints
  frontend/
    src/
      main.jsx         # React entry point
      App.jsx          # Main component
      api.js           # Axios client
      components/
        Dashboard.jsx  # Dashboard component
```

## Next Steps

- Set up PostgreSQL database
- Configure Alpaca API credentials (if upgrading from yfinance)
- Deploy with Docker/K8s
- Add paper trading execution
- Implement websocket for real-time updates
