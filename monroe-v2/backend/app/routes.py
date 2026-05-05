import os
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Query
from sqlalchemy.orm import Session
from .alpaca_client import latest_price, get_historical_data, get_symbol_info
from .strategy import evaluate
from .db import SessionLocal
from .models import Trade
import asyncio
import json

logger = logging.getLogger(__name__)
router = APIRouter()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, symbol: str):
        await websocket.accept()
        if symbol not in self.active_connections:
            self.active_connections[symbol] = []
        self.active_connections[symbol].append(websocket)
        logger.info(f"Client connected to {symbol}")

    def disconnect(self, websocket: WebSocket, symbol: str):
        if symbol in self.active_connections:
            self.active_connections[symbol].remove(websocket)
            if not self.active_connections[symbol]:
                del self.active_connections[symbol]
            logger.info(f"Client disconnected from {symbol}")

    async def broadcast(self, symbol: str, message: dict):
        if symbol in self.active_connections:
            disconnected = []
            for connection in self.active_connections[symbol]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending message: {e}")
                    disconnected.append(connection)
            
            for connection in disconnected:
                self.disconnect(connection, symbol)


manager = ConnectionManager()


@router.get("/dashboard")
def dashboard(symbol: str = Query(None)):
    """Get current trading signal and price data."""
    try:
        symbol = symbol or os.getenv("SYMBOL", "AAPL")
        price_data = latest_price(symbol)
        signal = evaluate(price_data["price"])
        
        response = {
            "symbol": symbol,
            "price": price_data["price"],
            "bid": price_data["bid"],
            "ask": price_data["ask"],
            "high": price_data.get("high"),
            "low": price_data.get("low"),
            "timestamp": price_data["timestamp"],
            "presence": signal["presence"],
            "mood": signal["mood"],
            "poise": signal["poise"],
            "selectivity": signal["selectivity"],
            "action": signal["action"]
        }
        return response
    except Exception as e:
        logger.error(f"Error in dashboard endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/price/{symbol}")
def get_price(symbol: str):
    """Get current price for a symbol."""
    try:
        price_data = latest_price(symbol)
        return price_data
    except Exception as e:
        logger.error(f"Error fetching price: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/history/{symbol}")
def get_history(symbol: str, period: str = "5d", interval: str = "1h"):
    """Get historical OHLCV data."""
    try:
        data = get_historical_data(symbol, period=period, interval=interval)
        return {"symbol": symbol, "data": data}
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/info/{symbol}")
def get_info(symbol: str):
    """Get symbol information."""
    try:
        info = get_symbol_info(symbol)
        return info
    except Exception as e:
        logger.error(f"Error fetching symbol info: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/trades")
def get_trades(db: Session = None, limit: int = 50):
    """Get recent trades from journal."""
    try:
        db = db or SessionLocal()
        trades = db.query(Trade).order_by(Trade.created_at.desc()).limit(limit).all()
        return [
            {
                "id": t.id,
                "symbol": t.symbol,
                "side": t.side,
                "qty": t.qty,
                "entry_price": t.entry_price,
                "exit_price": t.exit_price,
                "pnl": t.pnl,
                "state": t.state,
                "created_at": t.created_at.isoformat()
            }
            for t in trades
        ]
    except Exception as e:
        logger.error(f"Error fetching trades: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.websocket("/ws/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str):
    """WebSocket endpoint for real-time price streaming."""
    await manager.connect(websocket, symbol)
    try:
        while True:
            # Get latest price and signal
            try:
                price_data = latest_price(symbol)
                signal = evaluate(price_data["price"])
                
                message = {
                    "type": "price_update",
                    "symbol": symbol,
                    "price": price_data["price"],
                    "bid": price_data["bid"],
                    "ask": price_data["ask"],
                    "high": price_data.get("high"),
                    "low": price_data.get("low"),
                    "timestamp": price_data["timestamp"],
                    "presence": signal["presence"],
                    "mood": signal["mood"],
                    "poise": signal["poise"],
                    "selectivity": signal["selectivity"],
                    "action": signal["action"]
                }
                
                await websocket.send_json(message)
                
            except Exception as e:
                logger.error(f"Error in WebSocket loop: {e}")
                await websocket.send_json({
                    "type": "error",
                    "message": str(e)
                })
            
            # Update interval - 5 seconds
            await asyncio.sleep(5)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, symbol)
        logger.info(f"WebSocket disconnected for {symbol}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, symbol)


@router.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Monroe v2"}
