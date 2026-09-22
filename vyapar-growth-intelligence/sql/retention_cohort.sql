-- Cohort retention analysis pattern.
SELECT
  DATE_TRUNC('month', signup_date) AS cohort_month,
  DATE_TRUNC('month', activity_date) AS activity_month,
  COUNT(DISTINCT customer_id) AS active_customers
FROM customers c
JOIN customer_activity a USING (customer_id)
GROUP BY 1,2
ORDER BY 1,2;
