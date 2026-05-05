from pydantic import BaseModel

class DashboardResponse(BaseModel):
    presence: str
    mood: str
    poise: int
    selectivity: str
    action: str
    price: float
