import os
import yfinance as yf


def latest_price(symbol: str):
    ticker = yf.Ticker(symbol)
    data = ticker.history(period="1d", interval="1m")

    if data.empty:
        raise ValueError(f"No market data returned for {symbol}")

    return float(data["Close"].iloc[-1])
