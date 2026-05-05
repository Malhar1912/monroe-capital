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
