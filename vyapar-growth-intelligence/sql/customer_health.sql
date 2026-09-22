-- Illustrative analytical query: explain customer health rather than only ranking risk.
WITH activity AS (
  SELECT customer_id,
         active_days_30d,
         days_since_last_activity,
         invoice_count,
         transaction_value
  FROM customer_activity
),
features AS (
  SELECT customer_id,
         COUNT(DISTINCT feature_name) AS workflows_used
  FROM feature_usage
  WHERE usage_count_30d > 0
  GROUP BY customer_id
)
SELECT a.customer_id,
       (a.active_days_30d * 2)
       + LEAST(a.invoice_count, 20)
       + (COALESCE(f.workflows_used, 0) * 8)
       - (a.days_since_last_activity * 2) AS health_score,
       CASE
         WHEN a.days_since_last_activity >= 14 THEN 'Critical'
         WHEN a.days_since_last_activity >= 7 THEN 'At Risk'
         ELSE 'Healthy'
       END AS health_band
FROM activity a
LEFT JOIN features f ON f.customer_id = a.customer_id;
