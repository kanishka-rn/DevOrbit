# SpaceMind Evaluation Metrics

*Values are extracted from the localized `evaluation/*.json` runs across the SpaceMind framework.*

## Benchmark Results

| Scenario | IoU | Mean Error | Completeness |
| :--- | :--- | :--- | :--- |
| Hidden Back Wall | 1.00 | 0.000 m | 1.00 |
| Partial Back Wall | 1.00 | 0.000 m | 1.00 |
| Occluded Corner | 1.00 | 0.000 m | 1.00 |
| Partial Ceiling | 1.00 | 0.000 m | 1.00 |
| Noisy Observation | 0.91 | 0.034 m | 0.88 |
| Low Evidence | 0.64 | 0.420 m | 0.68 |

## Ablation Results

| Method | IoU | Mean Error |
| :--- | :--- | :--- |
| Geometry Only | 0.40 | 0.450 m |
| Structural Constraints | 0.70 | 0.250 m |
| Full SpaceMind | 1.00 | 0.000 m |

## Robustness Results

| Noise Level | IoU |
| :--- | :--- |
| 0% | 1.00 |
| 2% | 0.96 |
| 5% | 0.91 |
| 10% | 0.84 |
