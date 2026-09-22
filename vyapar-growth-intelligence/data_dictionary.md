# Data Dictionary

## customers
customer_id, business_type, city, signup_date, plan, acquisition_channel

## activity
customer_id, activity_date, active_days_30d, session_count, invoice_count, transaction_value, days_since_last_activity

## feature_usage
customer_id, feature_name, first_used_at, usage_count_30d, active_days_with_feature

## outcomes
customer_id, retained_30d, retained_60d, churn_flag

## voice_of_customer
review_date, rating, source, topic, sentiment, text_excerpt

## experiment
customer_id, cohort, onboarding_variant, activated_7d, retained_30d
