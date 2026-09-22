"""Reproducible analyst workflow for Vyapar Intelligence.
This script uses synthetic/modelled data and does not claim access to Vyapar internal data.
"""
import numpy as np
import pandas as pd

SEED = 42
rng = np.random.default_rng(SEED)
N = 12_000

regions = rng.choice(["South", "West", "North", "East"], N, p=[.32, .27, .23, .18])
industries = rng.choice(["Retail", "Hardware", "FMCG", "Electrical", "Home care", "Wholesale"], N)
customer_id = rng.integers(1, 2201, N)
feature_depth = np.clip(rng.normal(3.2, 1.4, N), 1, 6)
invoice_amount = np.exp(rng.normal(np.log(2800), .72, N))
paid_amount = np.minimum(invoice_amount, np.maximum(0, invoice_amount - rng.exponential(350, N)))
overdue_days = np.where(paid_amount < invoice_amount, rng.poisson(7, N), 0)
retention_probability = np.clip(.35 + .11 * feature_depth, 0, .95)
retained_30d = rng.random(N) < retention_probability

df = pd.DataFrame({
    "customer_id": customer_id, "region": regions, "industry": industries,
    "feature_depth": feature_depth, "invoice_amount": invoice_amount,
    "paid_amount": paid_amount, "overdue_days": overdue_days,
    "retained_30d": retained_30d
})

# Data quality gates
assert df.isna().any(axis=1).sum() == 0
assert df.duplicated().sum() == 0
assert (df.invoice_amount > 0).all()
assert (df.paid_amount >= 0).all()

revenue = df.invoice_amount.sum()
collection_rate = df.paid_amount.sum() / revenue
retention_30d = df.retained_30d.mean()
avg_overdue_days = df.loc[df.overdue_days > 0, "overdue_days"].mean()

low_depth = df.loc[df.feature_depth <= 2, "retained_30d"].mean()
high_depth = df.loc[df.feature_depth >= 4, "retained_30d"].mean()
retention_lift_pp = (high_depth - low_depth) * 100
depth_retention_corr = df[["feature_depth", "retained_30d"]].corr().iloc[0, 1]

regional_mix = (
    df.groupby("region")["invoice_amount"].sum()
      .div(revenue).mul(100).round(1).sort_values(ascending=False)
)

print(f"Rows: {len(df):,}")
print(f"Unique customers: {df.customer_id.nunique():,}")
print(f"Revenue: ₹{revenue:,.0f}")
print(f"Collection rate: {collection_rate:.1%}")
print(f"30D retention: {retention_30d:.1%}")
print(f"Workflow-depth retention lift: {retention_lift_pp:.1f} pp")
print(f"Depth/retention correlation: {depth_retention_corr:.3f}")
print("\nRegional contribution:")
print(regional_mix)

# Association is an investigation signal, not causal proof.
