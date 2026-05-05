# Monroe v2 — US Equities with Alpaca

A minimal production-style split monorepo using React + FastAPI + PostgreSQL.

---

## Project structure

```text
monroe-v2/
  backend/
    requirements.txt
    .env.example
    app/
      main.py
      db.py
      models.py
      schemas.py
      strategy.py
      alpaca_client.py
      routes.py
  frontend/
    package.json
    src/
      main.jsx
      App.jsx
      api.js
      components/Dashboard.jsx
```

---

## backend/requirements.txt

```txt
fastapi
uvicorn
sqlalchemy
psycopg2-binary
python-dotenv
yfinance
pydantic
```

## backend/.env.example

```env
DATABASE_URL=postgresql://postgres:postgres@localhost/monroe
SYMBOL=AAPL
```

## backend/app/db.py

```python
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()
```

## backend/app/models.py

```python
from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from .db import Base

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    side = Column(String, nullable=False)
    qty = Column(Float, nullable=False)
    entry_price = Column(Float, nullable=False)
    exit_price = Column(Float, nullable=True)
    pnl = Column(Float, default=0)
    state = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.utcnow)
```

## backend/app/schemas.py

```python
from pydantic import BaseModel

class DashboardResponse(BaseModel):
    presence: str
    mood: str
    poise: int
    selectivity: str
    action: str
    price: float
```

## backend/app/alpaca_client.py

```python
import os
import yfinance as yf


def latest_price(symbol: str):
    ticker = yf.Ticker(symbol)
    data = ticker.history(period="1d", interval="1m")

    if data.empty:
        raise ValueError(f"No market data returned for {symbol}")

    return float(data["Close"].iloc[-1])
```

## backend/app/strategy.py

```python
from collections import deque

prices = deque(maxlen=50)

class MonroeState:
    def __init__(self):
        self.volatility_state = "composed"
        self.selectivity_penalty = 0

state = MonroeState()


def evaluate(price: float):
    prices.append(price)

    if len(prices) < 20:
        return {
            "presence": "Watching",
            "mood": "Forming",
            "poise": 0,
            "selectivity": "High",
            "action": "Waiting"
        }

    recent = list(prices)
    avg = sum(recent[-20:]) / 20
    short = sum(recent[-5:]) / 5
    volatility = max(recent[-10:]) - min(recent[-10:])

    if volatility / price > 0.02:
        state.volatility_state = "guarded"
        state.selectivity_penalty = 2
    else:
        state.volatility_state = "composed"
        state.selectivity_penalty = max(0, state.selectivity_penalty - 1)

    poise = 5 if volatility / price < 0.01 else 3
    bullish = short > avg

    enter = bullish and poise >= 4 and state.selectivity_penalty <= 1

    return {
        "presence": "Entering" if enter else "Watching",
        "mood": "Quiet Uptrend" if bullish else "Neutral",
        "poise": poise,
        "selectivity": state.volatility_state,
        "action": "Buy" if enter else "Waiting"
    }
```

## backend/app/routes.py

```python
import os
from fastapi import APIRouter
from .alpaca_client import latest_price
from .strategy import evaluate

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    symbol = os.getenv("SYMBOL", "AAPL")
    price = latest_price(symbol)
    signal = evaluate(price)
    signal["price"] = price
    return signal
```

## backend/app/main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from .routes import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Monroe v2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
```

---

## frontend/package.json

```json
{
  "name": "monroe-frontend",
  "private": true,
  "version": "0.0.0",
  "dependencies": {
    "axios": "^1.7.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "vite": "^5.2.0"
  },
  "scripts": {
    "dev": "vite"
  }
}
```

## frontend/src/api.js

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api"
});
```

## frontend/src/components/Dashboard.jsx

```javascript
import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/dashboard");
      setData(res.data);
    };

    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  if (!data) return <div>Monroe is watching...</div>;

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Monroe</h1>
      <p>Presence: {data.presence}</p>
      <p>Mood: {data.mood}</p>
      <p>Poise: {data.poise}/5</p>
      <p>Selectivity: {data.selectivity}</p>
      <p>Action: {data.action}</p>
      <p>Price: ${data.price.toFixed(2)}</p>
    </div>
  );
}
```

## frontend/src/App.jsx

```javascript
import Dashboard from "./components/Dashboard";

export default function App() {
  return <Dashboard />;
}
```

## frontend/src/main.jsx

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Run backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Next production upgrades

- websocket live feed instead of polling
- simulated paper execution endpoint
- real EMA/ATR calculation with candles
- persistent trade journal
- adaptive post-shock expectancy learning
- multi-symbol scanner (AAPL, MSFT, NVDA, SPY)

