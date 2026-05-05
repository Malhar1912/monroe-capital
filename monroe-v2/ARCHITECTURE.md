# Monroe v2 - Architecture & Design

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             React Dashboard (Port 5173)              │   │
│  │  - Real-time price charts (Recharts)                │   │
│  │  - Monroe trading signals                            │   │
│  │  - Trade history journal                             │   │
│  │  - Connection status monitor                         │   │
│  │  - Multi-symbol selector                             │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬──────────────────────────────────────────────┘
                 │ HTTP/WebSocket
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                        API LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        FastAPI Server (Port 8000)                    │   │
│  │                                                       │   │
│  │  REST Endpoints:                                    │   │
│  │  - GET /api/dashboard?symbol=AAPL                   │   │
│  │  - GET /api/price/{symbol}                          │   │
│  │  - GET /api/history/{symbol}                        │   │
│  │  - GET /api/trades                                  │   │
│  │  - GET /api/health                                  │   │
│  │                                                       │   │
│  │  WebSocket:                                         │   │
│  │  - WS /api/ws/{symbol}                              │   │
│  │    (Real-time price streaming every 5 seconds)      │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬──────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌────────┐  ┌────────────┐  ┌──────────────┐
│ Price  │  │  Strategy  │  │   Trade      │
│ Data   │  │  Engine    │  │  Persistence │
│Layer   │  │            │  │   Layer      │
└────────┘  └────────────┘  └──────────────┘
    │            │                 │
    ▼            ▼                 ▼
┌────────────────────────────────────────────┐
│     External Data & Database Layer         │
│                                            │
│  - yfinance API (market data)             │
│  - PostgreSQL/SQLite (trade journal)       │
│  - Price cache (in-memory)                │
└────────────────────────────────────────────┘
```

---

## Component Architecture

### Backend Structure

```
backend/app/
├── main.py              # FastAPI application entry point
│   ├── Logging setup
│   ├── Database initialization
│   ├── CORS configuration
│   ├── Startup/shutdown events
│   └── Global exception handling
│
├── routes.py            # API endpoints & WebSocket
│   ├── REST endpoints
│   ├── WebSocket manager
│   ├── Connection pooling
│   └── Error handling
│
├── alpaca_client.py     # External data integration
│   ├── Price fetching (yfinance)
│   ├── Historical data retrieval
│   ├── Caching layer (TTL)
│   ├── Bid/ask calculation
│   └── Symbol information
│
├── strategy.py          # Trading logic
│   ├── Price buffer (50-tick deque)
│   ├── State machine
│   ├── Technical analysis
│   ├── Signal generation
│   └── Entry/exit logic
│
├── db.py                # Database layer
│   ├── SQLAlchemy engine
│   ├── Session factory
│   ├── .env loader
│   └── Connection pooling
│
├── models.py            # Data models
│   └── Trade model (ORM)
│
└── schemas.py           # Pydantic validation
    └── Request/response schemas
```

### Frontend Structure

```
frontend/src/
├── index.css            # Tailwind + custom styles
│   ├── Dark theme
│   ├── Component classes
│   └── Animations
│
├── main.jsx             # React entry point
│   └── CSS import
│
├── App.jsx              # Root component
│   └── Dashboard wrapper
│
├── api.js               # Axios HTTP client
│   └── Base URL configuration
│
└── components/
    ├── Dashboard.jsx        # Main component
    │   ├── WebSocket management
    │   ├── State management
    │   ├── Symbol switching
    │   ├── Data fetching
    │   └── Child component orchestration
    │
    ├── SignalCard.jsx       # Monroe signals display
    │   ├── Price display
    │   ├── Signal metrics
    │   ├── Poise bar
    │   ├── Color coding
    │   └── Status badges
    │
    ├── PriceChart.jsx       # Recharts visualizations
    │   ├── Area chart (price)
    │   ├── Volume chart
    │   ├── Tooltips
    │   └── Responsive layout
    │
    ├── ConnectionStatus.jsx # WebSocket monitor
    │   ├── Connection state
    │   ├── Error display
    │   └── Status indicator
    │
    └── TradeHistory.jsx     # Trade journal table
        ├── Trade list
        ├── Sorting
        ├── P&L formatting
        └── Status badges
```

---

## Data Flow

### Real-Time Price Update Flow

```
1. WebSocket Connection (Client)
   └──→ POST: /api/ws/{symbol}
       └──→ Dashboard.jsx creates WebSocket
       
2. Backend Processing
   ├──→ Connection Manager accepts connection
   ├──→ AsyncLoop starts (5-second interval)
   ├──→ Get latest_price() from alpaca_client
   ├──→ Run evaluate() from strategy
   ├──→ Format message as JSON
   └──→ Broadcast to all connected clients

3. Message Structure
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

4. Client Update
   └──→ WebSocket.onmessage()
       └──→ setData(message)
           └──→ Re-render components
               ├──→ SignalCard (update metrics)
               ├──→ PriceChart (add to chart)
               └──→ ConnectionStatus (show live)
```

### Historical Chart Load Flow

```
1. Component Mount (symbol changes)
   └──→ Dashboard.jsx useEffect

2. API Request
   └──→ api.get("/api/history/{symbol}")
       └──→ Axios HTTP GET

3. Backend Processing
   └──→ routes.get_history()
       └──→ alpaca_client.get_historical_data()
           └──→ yfinance ticker.history()
               └──→ Format OHLCV data

4. Response to Client
   {
     "symbol": "AAPL",
     "data": [
       {
         "timestamp": "2024-05-01T10:00:00",
         "open": 188.5,
         "high": 189.2,
         "low": 188.1,
         "close": 188.9,
         "volume": 1000000
       },
       ...
     ]
   }

5. Chart Rendering
   └──→ PriceChart.jsx
       └──→ Recharts AreaChart
           └──→ Display area + volume chart
```

### Trade Journal Flow

```
1. Component Mount
   └──→ useEffect() fetches trades

2. API Request
   └──→ GET /api/trades?limit=50

3. Backend Query
   └──→ db.query(Trade).order_by(created_at.desc())

4. Database Response
   └──→ PostgreSQL/SQLite returns rows

5. Formatting
   └──→ Convert ORM objects to JSON

6. Client Rendering
   └──→ TradeHistory.jsx table
       └──→ Map trades to rows
           └──→ Format numbers and colors
```

---

## Technology Stack

### Backend
- **Framework**: FastAPI (async, high-performance)
- **Server**: Uvicorn (ASGI)
- **Database**: PostgreSQL (production) / SQLite (dev)
- **ORM**: SQLAlchemy (async-ready)
- **Data**: yfinance (free market data)
- **Async**: asyncio (WebSocket, concurrent requests)
- **Validation**: Pydantic (strict types)
- **Logging**: Python logging (structured)

### Frontend
- **Framework**: React 18 (latest)
- **Build**: Vite (fast dev server)
- **Styling**: Tailwind CSS (utility-first)
- **HTTP**: Axios (promise-based)
- **Charts**: Recharts (responsive, composable)
- **Date**: date-fns (date manipulation)
- **CSS**: PostCSS + Autoprefixer

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git
- **Deployment**: Heroku, AWS, DigitalOcean, Vercel

---

## Performance Considerations

### Backend Optimizations
1. **Caching**: 60-second TTL on price data
2. **Connection Pooling**: 20 min / 40 max connections
3. **Async I/O**: WebSocket handles concurrent clients
4. **Database Indexing**: On symbol, created_at
5. **Rate Limiting**: TODO - implement per-client limits

### Frontend Optimizations
1. **Code Splitting**: Components lazy-loaded
2. **Memoization**: useMemo for expensive calculations
3. **WebSocket**: Instead of polling (5x reduction in requests)
4. **Image Optimization**: Minimal external assets
5. **CSS**: Tailwind PurgeCSS removes unused classes

### Scaling Strategies
1. **Load Balancing**: Multiple FastAPI instances
2. **Database Scaling**: Read replicas for analytics
3. **Caching Layer**: Redis for distributed caching
4. **Message Queue**: Celery for async tasks
5. **CDN**: CloudFront for static assets

---

## Security Architecture

```
Client (HTTPS/WSS)
    ↓
    ├─→ CORS validation
    ├─→ Input validation (Pydantic)
    └─→ Rate limiting (TODO)
        ↓
        ├─→ Authentication (TODO)
        ├─→ Authorization checks
        └─→ SQL injection prevention (SQLAlchemy)
            ↓
            ├─→ Database encryption (TLS)
            ├─→ Connection pooling security
            └─→ Secrets in environment
```

---

## Error Handling

### Backend
- Global exception handler in main.py
- Logging of all errors to console/file
- Graceful degradation for API failures
- WebSocket disconnect handling
- Database connection retries

### Frontend
- Error state in useState
- Try-catch in async functions
- User-friendly error messages
- Automatic reconnection attempts
- Fallback UI for loading states

---

## Testing Strategy

### Unit Tests
- `tests/test_strategy.py` - Strategy algorithm
- `tests/test_alpaca_client.py` - Price fetching
- `tests/test_routes.py` - API endpoints

### Integration Tests
- Database operations
- WebSocket connections
- Full request/response cycles

### E2E Tests
- Dashboard loading
- Real-time updates
- Multi-symbol switching
- Trade history display

---

## Deployment Architecture

### Development
```
Local Machine
├── Backend (localhost:8000)
├── Frontend (localhost:5173)
└── SQLite Database
```

### Production
```
Client CDN (Vercel)
    ↓
API Server (Heroku/AWS)
├── FastAPI instances (load balanced)
├── Database (AWS RDS/Supabase)
├── Redis cache (optional)
└── File storage (S3)
```

---

## Monitoring & Observability

### Metrics
- API response times
- WebSocket connection count
- Error rates
- Database query times
- Cache hit rates

### Logging
- Request/response logs
- Error traces
- Strategy signals
- Price updates (sampled)

### Alerting
- Uptime monitoring (UptimeRobot)
- Error rate threshold (Sentry)
- WebSocket connection issues
- Database connection pool exhaustion

---

**Architecture Last Updated**: May 2024  
**Maintainers**: Monroe Trading Team
