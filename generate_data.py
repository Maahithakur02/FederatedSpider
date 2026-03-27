import pandas as pd
import numpy as np
import os

def generate_datasets():
    os.makedirs('datasets', exist_ok=True)
    
    # Heart Disease
    df_heart = pd.DataFrame({
        'age': np.random.randint(20, 80, 5000),
        'cholesterol': np.random.randint(150, 300, 5000),
        'heart_rate': np.random.randint(60, 200, 5000),
        'blood_pressure': np.random.randint(90, 180, 5000),
        'target': np.random.randint(0, 2, 5000)
    })
    df_heart.to_csv('datasets/heart_disease.csv', index=False)
    
    # Diabetes
    df_diabetes = pd.DataFrame({
        'glucose': np.random.randint(70, 200, 5000),
        'bmi': np.random.uniform(18, 45, 5000),
        'age': np.random.randint(20, 80, 5000),
        'insulin': np.random.randint(15, 200, 5000),
        'target': np.random.randint(0, 2, 5000)
    })
    df_diabetes.to_csv('datasets/diabetes.csv', index=False)
    
    # Breast Cancer
    df_cancer = pd.DataFrame({
        'radius_mean': np.random.uniform(10, 30, 5000),
        'texture_mean': np.random.uniform(10, 40, 5000),
        'perimeter_mean': np.random.uniform(50, 150, 5000),
        'area_mean': np.random.uniform(200, 1500, 5000),
        'target': np.random.randint(0, 2, 5000)
    })
    df_cancer.to_csv('datasets/breast_cancer.csv', index=False)
    
    # Stroke
    df_stroke = pd.DataFrame({
        'age': np.random.randint(1, 90, 5000),
        'avg_glucose_level': np.random.uniform(50, 250, 5000),
        'bmi': np.random.uniform(15, 50, 5000),
        'hypertension': np.random.randint(0, 2, 5000),
        'target': np.random.randint(0, 2, 5000)
    })
    df_stroke.to_csv('datasets/stroke.csv', index=False)

if __name__ == "__main__":
    generate_datasets()
