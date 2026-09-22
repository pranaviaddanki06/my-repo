-- Compare feature adoption with downstream retention.
SELECT
  feature_name,
  COUNT(DISTINCT customer_id) AS adopters,
  AVG(CASE WHEN retained_30d = 1 THEN 1.0 ELSE 0.0 END) AS retention_rate
FROM feature_usage f
JOIN outcomes o USING (customer_id)
WHERE usage_count_30d > 0
GROUP BY feature_name
ORDER BY retention_rate DESC;
