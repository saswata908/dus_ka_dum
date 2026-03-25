# Trained ML Models

All 10 models are `sklearn.linear_model.LogisticRegression` classifiers
serialised with `pickle`. Place them in this folder.

## Files

| Model file | Columns/features file | Predicts |
|---|---|---|
| `model_morning_scroll.pkl`  | —                            | Morning SM scroll |
| `model_distraction.pkl`     | —                            | SM as distraction |
| `model_buying.pkl`          | `model_buying_columns.pkl`   | Buying influence |
| `model_privacy.pkl`         | `model_privacy_columns.pkl`  | Privacy concern |
| `model_reduce_usage.pkl`    | —                            | Want to reduce usage |
| `model_addiction.pkl`       | `model_addiction_features.pkl` | SM addiction |
| `mental_health_model.pkl`   | `mental_health_features.pkl` | Mental health impact |
| `model_attention.pkl`       | —                            | Attention span reduction |
| `model_week_without_sm.pkl` | —                            | Digital detox ability |
| `model_tools.pkl`           | `model_tools_columns.pkl`    | Uses limiting tools |

Also present: `model1_columns.pkl`, `model2_columns.pkl`, `premium_model.pkl`

## Python loading example

```python
import pickle, numpy as np

with open('model_addiction.pkl', 'rb') as f:
    model = pickle.load(f)

with open('model_addiction_features.pkl', 'rb') as f:
    features = pickle.load(f)   # list of 37 feature names

X = np.zeros((1, len(features)))
print(model.predict(X))         # ['No'] / ['Yes']
print(model.predict_proba(X))   # [[0.72, 0.28]]
```

Requires `scikit-learn >= 1.4`.
