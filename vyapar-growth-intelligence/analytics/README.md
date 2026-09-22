# Vyapar Intelligence — Analytical Evidence Layer

This folder is the reproducible analytical layer behind the portfolio prototype.

Pipeline:
Synthetic source -> quality checks -> SQL-style transformations -> Python analysis -> diagnostic signals -> decision views

The dataset is deliberately synthetic/modelled. It does not represent Vyapar internal data.

What this demonstrates:
- Data modeling for customers, transactions and product usage
- SQL joins, aggregation and customer-health transformations
- Data-quality checks for nulls, duplicates and positive monetary values
- KPI calculation for revenue, collection rate, retention and overdue days
- Segmentation by workflow depth
- Association analysis between workflow depth and 30-day retention
- Regional contribution analysis
- Guardrails against causal overclaiming

Reproduce:
1. Install Python, pandas and numpy.
2. Run analysis.py.
3. Compare output with metrics.json.
4. Use schema.sql as the SQL transformation / warehouse layer.

Interpretation:
The workflow-depth finding is an association signal. It helps decide what to test next, but does not prove that deeper workflow adoption causes retention. A controlled activation experiment is the next validation step.

Portfolio disclosure:
The application is a portfolio simulation. Metrics, customer records and analytical outputs are synthetic/modelled and must not be interpreted as Vyapar internal performance or proprietary data.
