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
