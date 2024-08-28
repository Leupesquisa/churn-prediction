# @author Leu A. Manuel
# @see https://github.com/Leupesquisa

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from sklearn.preprocessing import LabelEncoder, StandardScaler
from api.serializers.training_serializer import TrainingSerializer
from core.machine_learning import ChurnModel, preprocess_data
from core.data_preprocessing import preprocess_dataset
from sklearn.model_selection import train_test_split
from imblearn.under_sampling import RandomUnderSampler
import pandas as pd


class TrainModelView(APIView):
    def post(self, request):
        # Se o dataset não for fornecido, será utilizado o dataset padrão
        # if 'dataset' in request.data:
        #     df = pd.DataFrame(request.data['dataset'])
        # else:
        # Carregar o dataset
        DATA_PATH = "https://raw.githubusercontent.com/carlosfab/dsnp2/master/datasets/WA_Fn-UseC_-Telco-Customer-Churn.csv"
        df = pd.read_csv(DATA_PATH)

        # Pré-processamento dos dados
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')

        # Original (warning) df['TotalCharges'].fillna(df['TotalCharges'].median(), inplace=True)
        ## actualizar(without warning) df = df.copy() df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())

        # Fix for the FutureWarning
        df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())
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
                      
        model_type = request.data.get('model_type', 'logistic_regression')
        churn_model = ChurnModel(model_type=model_type)
        churn_model.train(X_train_resampled, y_train_resampled)
                       
        return Response({"message": f"Model {model_type} trained and saved successfully!"}, status=status.HTTP_200_OK)
