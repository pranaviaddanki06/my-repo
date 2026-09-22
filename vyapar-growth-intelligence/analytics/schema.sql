-- Vyapar Intelligence synthetic analytics schema
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  region VARCHAR(20) NOT NULL,
  industry VARCHAR(40) NOT NULL,
  signup_month INTEGER NOT NULL,
  feature_depth NUMERIC(4,2) NOT NULL
);

CREATE TABLE transactions (
  transaction_id BIGINT PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
  month INTEGER NOT NULL,
  invoice_amount NUMERIC(12,2) NOT NULL CHECK (invoice_amount > 0),
  paid_amount NUMERIC(12,2) NOT NULL CHECK (paid_amount >= 0),
  overdue_days INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE product_usage (
  customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
  feature_name VARCHAR(60) NOT NULL,
  adopted BOOLEAN NOT NULL,
  usage_events INTEGER NOT NULL DEFAULT 0
);

CREATE VIEW customer_health AS
SELECT c.customer_id, c.region, c.industry, c.feature_depth,
       SUM(t.invoice_amount) AS billed_value,
       SUM(t.paid_amount) AS collected_value,
       AVG(t.overdue_days) AS avg_overdue_days,
       CASE WHEN c.feature_depth >= 4 THEN 'Deep workflow'
            WHEN c.feature_depth >= 3 THEN 'Developing workflow'
            ELSE 'Shallow workflow' END AS workflow_band
FROM customers c
JOIN transactions t ON t.customer_id = c.customer_id
GROUP BY c.customer_id, c.region, c.industry, c.feature_depth;

SELECT workflow_band, COUNT(*) AS customers,
       ROUND(AVG(retained_30d)::numeric * 100, 1) AS retention_rate
FROM customer_health
GROUP BY workflow_band
ORDER BY retention_rate DESC;
