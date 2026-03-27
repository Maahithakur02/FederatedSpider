import sys
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import log_loss
import joblib
import json
import time
import os

def send(update):
    print(json.dumps(update), flush=True)

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def grad_step(X, y, w, b, lr=0.05, n_steps=1):
    """Gradient descent steps for logistic loss."""
    n = len(y)
    for _ in range(n_steps):
        scores = X @ w + b
        proba = sigmoid(scores)
        err = proba - y
        grad_w = X.T @ err / n
        grad_b = err.mean()
        w = w - lr * grad_w
        b = b - lr * grad_b
    return w, float(b)

def eval_model(X, y, w, b):
    proba_1 = sigmoid(X @ w + b)
    preds = (proba_1 >= 0.5).astype(int)
    acc = (preds == y).mean()
    proba = np.column_stack([1 - proba_1, proba_1])
    proba = np.clip(proba, 1e-7, 1 - 1e-7)
    loss = -np.mean(y * np.log(proba[:, 1]) + (1 - y) * np.log(proba[:, 0]))
    return float(acc), float(loss)

def train_federated(dataset_name):
    df = pd.read_csv(f'datasets/{dataset_name}.csv')
    X_all = df.drop('target', axis=1).values.astype(float)
    y_all = df['target'].values.astype(int)

    scaler = StandardScaler()
    X_all = scaler.fit_transform(X_all)

    np.random.seed(42)
    perm = np.random.permutation(len(X_all))
    partitions = np.array_split(perm, 3)
    hospitals = ['Hospital A', 'Hospital B', 'Hospital C']
    n_features = X_all.shape[1]

    # Start from zeros — model must learn from scratch via federation
    global_w = np.zeros(n_features)
    global_b = 0.0

    total_rounds = 5
    # More gradient steps each round simulates richer training
    steps_per_round = [3, 8, 18, 35, 60]
    lr_per_round = [0.08, 0.06, 0.05, 0.04, 0.03]

    for round_num in range(1, total_rounds + 1):
        hospital_ws = []
        hospital_bs = []
        hospital_accs = []
        hospital_losses = []
        n_steps = steps_per_round[round_num - 1]
        lr = lr_per_round[round_num - 1]

        for i, hospital in enumerate(hospitals):
            send({"status": f"Local training at {hospital}...", "round": round_num})
            time.sleep(0.8)

            idx = partitions[i]
            X_local, y_local = X_all[idx], y_all[idx]

            # Warm-start from global weights, do local gradient steps
            w, b = grad_step(X_local, y_local, global_w.copy(), global_b, lr=lr, n_steps=n_steps)

            acc, loss = eval_model(X_local, y_local, w, b)
            hospital_ws.append(w.tolist())
            hospital_bs.append(b)
            hospital_accs.append(round(acc * 100, 2))
            hospital_losses.append(round(loss, 4))

        weights_payload = [
            {"hospital": h, "values": hospital_ws[i], "accuracy": hospital_accs[i], "loss": hospital_losses[i]}
            for i, h in enumerate(hospitals)
        ]

        send({
            "status": "Sending encrypted model updates...",
            "round": round_num,
            "weights": weights_payload,
            "hospitalAccuracies": hospital_accs
        })
        time.sleep(0.8)

        send({"status": "Aggregating weights (FedAvg)...", "round": round_num})

        # FedAvg: weighted average by partition size
        n_total = sum(len(partitions[i]) for i in range(3))
        global_w = sum(
            (len(partitions[i]) / n_total) * np.array(hospital_ws[i])
            for i in range(3)
        )
        global_b = sum(
            (len(partitions[i]) / n_total) * hospital_bs[i]
            for i in range(3)
        )
        time.sleep(0.8)

        global_acc, global_loss = eval_model(X_all, y_all, global_w, global_b)

        send({
            "status": "Global model updated",
            "round": round_num,
            "accuracy": round(global_acc * 100, 2),
            "loss": round(global_loss, 4),
            "hospitalAccuracies": hospital_accs,
            "weights": weights_payload
        })
        time.sleep(0.5)

    os.makedirs('models', exist_ok=True)
    joblib.dump({
        "coef": global_w.tolist(),
        "intercept": float(global_b),
        "scaler_mean": scaler.mean_.tolist(),
        "scaler_scale": scaler.scale_.tolist(),
        "dataset": dataset_name
    }, 'models/global_model.pkl')

    send({"status": "Completed", "round": total_rounds})

if __name__ == "__main__":
    if len(sys.argv) > 1:
        train_federated(sys.argv[1])
