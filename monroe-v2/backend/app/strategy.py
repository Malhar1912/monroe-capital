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
