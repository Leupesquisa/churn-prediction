import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import recall_score
from imblearn.under_sampling import RandomUnderSampler
import joblib
from pymongo import MongoClient

# Conecte ao MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['churn_prediction_db']
collection = db['models']

# Carregar o dataset
DATA_PATH = "https://raw.githubusercontent.com/Leupesquisa/churn-prediction/main/WA_Fn-UseC_-Telco-Customer-Churn.csv"
df = pd.read_csv(DATA_PATH)

# Pré-processamento dos dados
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')

# Original (warning) df['TotalCharges'].fillna(df['TotalCharges'].median(), inplace=True)
## actualizar(without warning) df = df.copy() df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())

df['TotalCharges'].fillna(df['TotalCharges'].median(), inplace=True)
df.drop(['customerID', 'gender'], axis=1, inplace=True)

binary_columns = ['SeniorCitizen', 'Partner', 'Dependents', 'PhoneService', 'PaperlessBilling', 'Contract', 'Churn']
le = LabelEncoder()
for col in binary_columns:
    df[col] = le.fit_transform(df[col])

categorical_columns = ['MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies', 'PaymentMethod']
df = pd.get_dummies(df, columns=categorical_columns)

scaler = StandardScaler()
df[['tenure', 'MonthlyCharges', 'TotalCharges']] = scaler.fit_transform(df[['tenure', 'MonthlyCharges', 'TotalCharges']])

X = df.drop('Churn', axis=1)
y = df['Churn']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)
rus = RandomUnderSampler(random_state=42)
X_train_resampled, y_train_resampled = rus.fit_resample(X_train, y_train)

model = LogisticRegression(random_state=42)
model.fit(X_train_resampled, y_train_resampled)

y_pred = model.predict(X_test)
recall = recall_score(y_test, y_pred)
print(f"Model Recall: {recall:.2f}")

# Salvar o modelo em um arquivo
joblib.dump(model, 'model.pkl')

# Armazenar o modelo no MongoDB
with open('model.pkl', 'rb') as f:
    model_data = f.read()

collection.insert_one({'model': model_data})
