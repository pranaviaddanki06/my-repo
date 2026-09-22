"""Explainable customer health scoring prototype."""
def health_score(active_days, invoices, workflows, days_since_last_activity):
    score = (active_days * 2) + min(invoices, 20) + (workflows * 8) - (days_since_last_activity * 2)
    return max(0, min(100, score))

def band(score):
    if score < 35:
        return "Critical"
    if score < 60:
        return "At Risk"
    return "Healthy"
