# Monroe v2 - Quick Reference Guide

## 🚀 Quick Commands

### Setup & Installation
```bash
# Windows
cd monroe-v2
setup.bat

# macOS/Linux
cd monroe-v2
chmod +x setup.sh
./setup.sh
```

### Using Make Commands
```bash
make help          # List all available commands
make install       # Install all dependencies
make dev           # Display development instructions
make backend       # Run backend only
make frontend      # Run frontend only
make docker-up     # Start with Docker Compose
make docker-down   # Stop Docker services
make clean         # Clean build artifacts
```

### Manual Development
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # Update DATABASE_URL if needed
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - Logs (optional)
cd backend
tail -f logs/monroe.log        # Monitor logs
```

### Docker
```bash
docker-compose up              # Start all services
docker-compose down            # Stop services
docker-compose logs -f         # Watch logs
docker-compose down -v         # Clean everything
```

---

## 📡 API Quick Reference

### Current Signal & Price
```bash
curl http://localhost:8000/api/dashboard?symbol=AAPL
```

### Get Current Price
```bash
curl http://localhost:8000/api/price/MSFT
```

### Historical Data (5-day hourly)
```bash
curl "http://localhost:8000/api/history/NVDA?period=5d&interval=1h"
```

### Trade Journal
```bash
curl "http://localhost:8000/api/trades?limit=50"
```

### Health Check
```bash
curl http://localhost:8000/api/health
```

### API Documentation
```
http://localhost:8000/docs      # Interactive Swagger UI
http://localhost:8000/redoc     # ReDoc documentation
```

---

## 🔗 Default URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Dashboard UI |
| Backend | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/docs | Interactive docs |
| Database | localhost:5432 | PostgreSQL (Docker) |

---

## 📊 WebSocket Connection

```javascript
// JavaScript example
const ws = new WebSocket('ws://localhost:8000/api/ws/AAPL');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Price update:', data.price);
  console.log('Signal:', data.action);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket disconnected');
};
```

---

## 🔧 Configuration Files

### Backend Configuration (.env)
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost/monroe
# Or for SQLite
DATABASE_URL=sqlite:///./monroe.db

# Trading
SYMBOL=AAPL

# Logging
LOG_LEVEL=INFO
```

### Frontend Configuration (src/api.js)
```javascript
baseURL: "http://localhost:8000/api"
```

---

## 📁 File Structure Quick Reference

```
Backend API:
- GET    /api/dashboard         → Current signal
- GET    /api/price/:symbol     → Current price
- GET    /api/history/:symbol   → Historical data
- GET    /api/trades            → Trade journal
- GET    /api/health            → Health status
- WS     /api/ws/:symbol        → Real-time stream

Frontend Components:
- Dashboard.jsx        - Main container + WebSocket
- SignalCard.jsx       - Monroe metrics
- PriceChart.jsx       - Recharts visualization
- ConnectionStatus.jsx - Status indicator
- TradeHistory.jsx     - Trade journal table
```

---

## 🐛 Debugging

### Backend Logs
```bash
# Check logs in real-time
tail -f backend/app.log

# Run with debug logging
LOG_LEVEL=DEBUG uvicorn app.main:app --reload
```

### Frontend Console
```javascript
// Open browser console (F12)
// WebSocket events show in console
// Check for 404 errors on API calls
```

### Database Connection
```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d monroe

# View tables
\dt

# Quit
\q
```

### Kill Port Processes
```bash
# macOS/Linux - Kill process on port 8000
lsof -ti :8000 | xargs kill -9

# Windows - Show processes on port
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## 📦 Adding Dependencies

### Python Package
```bash
cd backend
pip install package-name
pip freeze > requirements.txt
```

### npm Package
```bash
cd frontend
npm install package-name
```

---

## 🧪 Testing

### Backend
```bash
pip install pytest
pytest tests/ -v
```

### Frontend
```bash
npm test
```

---

## 📈 Monitoring in Development

### Backend Health
```bash
curl http://localhost:8000/api/health
# Response: {"status": "healthy", "service": "Monroe v2"}
```

### WebSocket Connection Count
```bash
# Check logs for "Client connected" messages
```

### Frontend Console Warnings
- Check browser console for React warnings
- Check Network tab for failed requests

---

## 🔑 Common Tasks

### Change Trading Symbol
Edit `backend/.env`:
```env
SYMBOL=SPY  # Change to any ticker
```
Restart backend to apply.

### Switch Database (SQLite ↔ PostgreSQL)
Edit `backend/.env`:
```env
# SQLite
DATABASE_URL=sqlite:///./monroe.db

# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost/monroe
```

### Add Multi-Symbol Support
Edit `frontend/src/components/Dashboard.jsx`:
```javascript
const SYMBOLS = ["AAPL", "MSFT", "NVDA", "SPY", "QQQ", "TSLA", "YOUR_SYMBOL"];
```

### Customize Dashboard Styling
- Edit `frontend/src/index.css` for global styles
- Edit `frontend/tailwind.config.js` for theme
- Edit component files for component-specific styles

---

## 🚀 Deployment Quick Links

| Platform | Time to Deploy | Difficulty |
|----------|---|---|
| Heroku | 15 min | Easy |
| DigitalOcean | 20 min | Medium |
| AWS | 30 min | Medium |
| Docker + own server | 30 min | Medium |

See `DEPLOYMENT.md` for detailed steps.

---

## 📖 Documentation Map

```
Getting Started:
├─ README.md                    (Overview + Features)
├─ IMPLEMENTATION_SUMMARY.md    (What was built)
└─ setup.sh / setup.bat         (Automated setup)

Development:
├─ DEVELOPMENT.md               (Setup + Workflow)
└─ ARCHITECTURE.md              (System design)

Deployment:
├─ DEPLOYMENT.md                (Production setup)
└─ docker-compose.yml           (Docker setup)

Reference:
├─ QUICK_REFERENCE.md           (This file)
└─ Makefile                     (Common commands)
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Address already in use" | `make clean` or kill process on port |
| Module not found | Run `pip install -r requirements.txt` |
| WebSocket won't connect | Ensure backend running on 8000 |
| No npm modules | Run `npm install` in frontend |
| Database error | Check DATABASE_URL in .env |
| Blank dashboard | Check browser console for errors |
| Slow charts | Reduce data points or use shorter period |

---

## 💡 Pro Tips

1. **Use .env.example as template** - Never commit actual .env
2. **Check logs first** - Always look at console output
3. **Browser DevTools** - F12 for Network/Console debugging
4. **API Docs are helpful** - Visit http://localhost:8000/docs
5. **Watch websocket messages** - Shows real-time data updates
6. **Test with SQLite first** - Easier than PostgreSQL setup
7. **Use Docker for clean environment** - `docker-compose up`

---

## 📞 When You Get Stuck

1. **Check Logs** - Backend and browser console
2. **Read Documentation** - Check README.md first
3. **Look at Similar Code** - Find patterns in codebase
4. **Try Simpler Version** - Test with SQLite, one symbol
5. **Review API Docs** - http://localhost:8000/docs
6. **Ask Questions** - Document what you tried

---

## ✨ Key Features Summary

```
✅ Real-time WebSocket streaming (5-second updates)
✅ Interactive Recharts with price + volume
✅ Monroe trading strategy with poise levels
✅ Multi-symbol support (AAPL, MSFT, NVDA, SPY, QQQ, TSLA)
✅ Trade journal with P&L tracking
✅ Connection status indicator
✅ Production-ready error handling
✅ Docker support for easy deployment
✅ Comprehensive documentation
✅ Fast, responsive UI with Tailwind CSS
```

---

**Version**: 2.0.0  
**Last Updated**: May 2024  
**Status**: Production Ready ✅
