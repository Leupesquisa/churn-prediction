# @author Leu A. Manuel
# @see https://github.com/Leupesquisa
# (Logic for data preprocessing, including type conversion and calculation of basic statistics.)

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler

def converter_str_float(value):
    try:
        return float(value)
    except ValueError:
        return np.nan

def preprocess_dataset(df=None):
    if df is None:
        # Carregar o dataset a partir do link
        url = 'https://raw.githubusercontent.com/Leupesquisa/churn-prediction/main/WA_Fn-UseC_-Telco-Customer-Churn.csv'
        df = pd.read_csv(url)

    # Pré-processamento dos dados
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    
    # Preencher valores faltantes na coluna 'TotalCharges'
    missing_totalcharges = df['TotalCharges'].isna().sum()
    df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())
    
    # Cálculo da porcentagem de valores ausentes
    missing_percentage = round((df.isnull().sum() / df.shape[0]) * 100, 2)
    
    # Distribuição do churn
    churn_distribution = df['Churn'].value_counts(normalize=True) * 100
    
    # Distribuição por gênero
    gender_distribution = df['gender'].value_counts(normalize=True) * 100
     
    df.drop(['customerID', 'gender'], axis=1, inplace=True)

    binary_columns = ['SeniorCitizen', 'Partner', 'Dependents', 'PhoneService', 'PaperlessBilling', 'Contract', 'Churn']
    le = LabelEncoder()
    for col in binary_columns:
        df[col] = le.fit_transform(df[col])

    categorical_columns = ['MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies', 'PaymentMethod']
    df = pd.get_dummies(df, columns=categorical_columns)

    scaler = StandardScaler()
    df[['tenure', 'MonthlyCharges', 'TotalCharges']] = scaler.fit_transform(df[['tenure', 'MonthlyCharges', 'TotalCharges']])
    
    df.fillna(0, inplace=True)  # Preenche valores nulos com 0
    
    return {
        "missing_totalcharges": missing_totalcharges,
        "missing_percentage": missing_percentage,
        "churn_distribution": churn_distribution,
        "gender_distribution": gender_distribution,
        "dataframe": df
    }, df
