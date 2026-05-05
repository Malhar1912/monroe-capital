# Monroe v2 — Production-Ready Algorithmic Trading System

A high-performance, production-ready US equities trading system with **real-time WebSocket streaming**, **live market data**, and **modern web dashboard**.

Built with:
- **Backend**: FastAPI + PostgreSQL + SQLAlchemy
- **Frontend**: React + Tailwind CSS + Recharts
- **Data**: Real-time yfinance + WebSocket streaming
- **Strategy**: Monroe volatility-based trading algorithm

---

## 🚀 Features

✅ **Real-time WebSocket Streaming** - Live price updates every 5 seconds  
✅ **Live Charts** - Interactive price and volume charts with Recharts  
✅ **Multi-Symbol Support** - Trade AAPL, MSFT, NVDA, SPY, QQQ, TSLA and more  
✅ **Trade Journal** - Persistent trade history and P&L tracking  
✅ **Connection Status** - Real-time connection monitoring  
✅ **Monroe Strategy** - Volatility-based entry signals with poise levels  
✅ **Error Handling** - Production-grade error recovery and logging  
✅ **Caching** - Smart price caching to minimize API calls  
✅ **Responsive UI** - Dark theme dashboard with real-time updates  

---

## 📋 Prerequisites

- **Python 3.8+** (recommend 3.10+)
- **Node.js 16+** with npm
- **PostgreSQL 12+** (optional, can use SQLite for development)

---

## ⚡ Quick Start

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your database connection

# Run migrations and start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend runs on**: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/monroe

# Trading
SYMBOL=AAPL

# Optional
LOG_LEVEL=INFO
```

For SQLite (development):
```env
DATABASE_URL=sqlite:///./monroe.db
```

---

## 📡 API Endpoints

### REST Endpoints

- `GET /api/dashboard?symbol=AAPL` - Current signal and price data
- `GET /api/price/{symbol}` - Get current price with bid/ask
- `GET /api/history/{symbol}` - Historical OHLCV data
- `GET /api/info/{symbol}` - Symbol information
- `GET /api/trades` - Trade journal entries
- `GET /api/health` - Health check

### WebSocket

- `WS /api/ws/{symbol}` - Real-time price streaming (connects automatically)

**Example WebSocket Message:**
```json
{
  "type": "price_update",
  "symbol": "AAPL",
  "price": 189.45,
  "bid": 189.44,
  "ask": 189.46,
  "high": 190.12,
  "low": 188.90,
  "timestamp": "2024-05-05T14:30:00",
  "presence": "Entering",
  "mood": "Quiet Uptrend",
  "poise": 4,
  "selectivity": "composed",
  "action": "Buy"
}
```

---

## 🎯 Monroe Trading Strategy

The Monroe algorithm evaluates market conditions and generates trading signals:

### Signal Components

| Component | Range | Meaning |
|-----------|-------|---------|
| **Presence** | Watching/Entering | Market entry readiness |
| **Mood** | Neutral/Quiet Uptrend | Trend direction |
| **Poise** | 0-5 | Signal confidence (lower volatility = higher poise) |
| **Selectivity** | composed/guarded | Market volatility state |
| **Action** | Waiting/Buy | Trading recommendation |

### Entry Logic

Monroe enters positions when:
- Short-term MA > Long-term MA (bullish)
- Poise ≥ 4 (low volatility)
- Selectivity penalty ≤ 1 (calm market)

---

## 🏗️ Project Structure

```
monroe-v2/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + logging
│   │   ├── db.py                # SQLAlchemy setup
│   │   ├── models.py            # Trade model
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── alpaca_client.py     # Price/data fetching + caching
│   │   ├── strategy.py          # Monroe algorithm
│   │   └── routes.py            # API + WebSocket endpoints
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── SignalCard.jsx       # Monroe signals
│   │   │   ├── PriceChart.jsx       # Price/volume charts
│   │   │   ├── ConnectionStatus.jsx # WebSocket status
│   │   │   └── TradeHistory.jsx     # Trade journal
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css               # Tailwind + custom styles
│   │   └── api.js                  # Axios client
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🗄️ Database Setup

### PostgreSQL (Recommended for Production)

```bash
# Create database
createdb monroe

# Connection string
DATABASE_URL=postgresql://user:password@localhost/monroe
```

### SQLite (Development)

```bash
# Automatic setup
DATABASE_URL=sqlite:///./monroe.db
```

Tables auto-created on startup:
- `trades` - Trade journal with P&L tracking

---

## 📊 Monitoring & Logging

Server logs to console with timestamps:

```
2024-05-05 14:30:00 - app.routes - INFO - Client connected to AAPL
2024-05-05 14:30:05 - app.routes - INFO - Price update: $189.45
```

Monitor real-time connections in logs or through `/api/health` endpoint.

---

## 🚀 Production Deployment

### Docker

Create `Dockerfile` in backend:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app/ app/
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t monroe-api .
docker run -p 8000:8000 -e DATABASE_URL=... monroe-api
```

### Deployment Services

- **Backend**: Heroku, Railway, AWS EC2, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: AWS RDS PostgreSQL, Supabase, Railway

### Environment Variables for Production

```env
DATABASE_URL=postgresql://user:pass@prod-db:5432/monroe
SYMBOL=SPY
LOG_LEVEL=INFO
```

---

## 🔐 Security Considerations

- ✅ CORS enabled for development (restrict in production)
- ✅ Input validation via Pydantic
- ✅ Error handling without stack traces to client
- ✅ WebSocket connection management
- TODO: Add API key authentication
- TODO: Add rate limiting
- TODO: SSL/TLS for production

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit pull request

---

## 📈 Roadmap

- [x] Real-time WebSocket streaming
- [x] Interactive charts (Recharts)
- [x] Multi-symbol support
- [x] Trade journal
- [ ] Paper trading execution
- [ ] Historical backtesting
- [ ] Performance analytics
- [ ] Email/SMS alerts
- [ ] Mobile app
- [ ] Advanced charting (TradingView)
- [ ] Machine learning strategy optimization

---

## ⚠️ Disclaimer

Monroe v2 is for **educational and research purposes only**. It is not financial advice. Always:
- Test with small amounts first
- Never risk capital you can't afford to lose
- Understand the strategy before deploying
- Monitor positions actively
- Have a risk management plan

---

## 📄 License

MIT License - see LICENSE file

---

## 💬 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Submit a pull request
- Email support@monroetrading.io

---

**Monroe v2** - Built for traders, engineers, and quants.  
*Last updated: May 2024*
