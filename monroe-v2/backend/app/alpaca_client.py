import os
import yfinance as yf
import logging
from typing import Optional, Dict, List
from datetime import datetime, timedelta
import threading
import time

logger = logging.getLogger(__name__)

# Cache for price data to avoid excessive API calls
_price_cache: Dict[str, Dict] = {}
_cache_lock = threading.Lock()
_cache_ttl = 60  # 60 seconds


def get_cached_price(symbol: str) -> Optional[Dict]:
    """Get cached price if still valid."""
    with _cache_lock:
        if symbol in _price_cache:
            cache_entry = _price_cache[symbol]
            if datetime.now() - cache_entry["timestamp"] < timedelta(seconds=_cache_ttl):
                return cache_entry["data"]
    return None


def cache_price(symbol: str, price: float, bid: float, ask: float):
    """Cache price data."""
    with _cache_lock:
        _price_cache[symbol] = {
            "timestamp": datetime.now(),
            "data": {
                "price": price,
                "bid": bid,
                "ask": ask,
                "timestamp": datetime.now().isoformat()
            }
        }


def latest_price(symbol: str) -> Dict:
    """Get latest price with bid/ask spread."""
    try:
        # Check cache first
        cached = get_cached_price(symbol)
        if cached:
            return cached

        ticker = yf.Ticker(symbol)
        
        # Get 5-minute data for more frequent updates
        data = ticker.history(period="1d", interval="5m")
        
        if data.empty:
            logger.error(f"No market data for {symbol}")
            raise ValueError(f"No market data returned for {symbol}")
        
        close_price = float(data["Close"].iloc[-1])
        high_price = float(data["High"].iloc[-1])
        low_price = float(data["Low"].iloc[-1])
        
        # Simulate bid/ask spread (2-3 pips)
        spread = (high_price - low_price) * 0.001 if high_price > low_price else 0.01
        bid = close_price - spread / 2
        ask = close_price + spread / 2
        
        result = {
            "price": close_price,
            "bid": bid,
            "ask": ask,
            "high": high_price,
            "low": low_price,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_price(symbol, close_price, bid, ask)
        return result
        
    except Exception as e:
        logger.error(f"Error fetching price for {symbol}: {e}")
        raise


def get_historical_data(symbol: str, period: str = "5d", interval: str = "1h") -> List[Dict]:
    """Get historical OHLCV data for charting."""
    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(period=period, interval=interval)
        
        if data.empty:
            return []
        
        ohlcv_data = []
        for timestamp, row in data.iterrows():
            ohlcv_data.append({
                "timestamp": timestamp.isoformat(),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": float(row["Volume"])
            })
        
        return ohlcv_data
        
    except Exception as e:
        logger.error(f"Error fetching historical data for {symbol}: {e}")
        return []


def get_symbol_info(symbol: str) -> Dict:
    """Get symbol information."""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        return {
            "symbol": symbol,
            "name": info.get("longName", symbol),
            "currency": info.get("currency", "USD"),
            "market_cap": info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "dividend_yield": info.get("dividendYield")
        }
    except Exception as e:
        logger.error(f"Error fetching symbol info for {symbol}: {e}")
        return {"symbol": symbol, "name": symbol}
