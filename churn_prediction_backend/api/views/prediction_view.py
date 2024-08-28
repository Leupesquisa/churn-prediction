# @author Leu A. Manuel
# @see https://github.com/Leupesquisa

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.serializers.prediction_serializer import PredictionSerializer
from core.machine_learning import ChurnModel
from core.model_storage import load_model_from_mongodb
from sklearn.preprocessing import LabelEncoder, StandardScaler
import pandas as pd

class PredictView(APIView):
    def post(self, request, *args, **kwargs):
        # Receber os dados do cliente
        #data = request.data
        serializer = PredictionSerializer(data=request.data)
        if serializer.is_valid():
            customer_data = pd.DataFrame([serializer.validated_data['customer_data']])
            model_type = serializer.validated_data['model_type']
            #churn_model = ChurnModel(model_type=model_type, load_existing=True)
            churn_model =  load_model_from_mongodb(model_name=model_type)
          
                      
            # Transformar os dados do cliente em um DataFrame
            #customer_data = pd.DataFrame([data])

            # Converter colunas numéricas para tipo numérico
            customer_data['tenure'] = pd.to_numeric(customer_data['tenure'], errors='coerce')
            customer_data['MonthlyCharges'] = pd.to_numeric(customer_data['MonthlyCharges'], errors='coerce')
            customer_data['TotalCharges'] = pd.to_numeric(customer_data['TotalCharges'], errors='coerce')

            # Preencher valores faltantes nas colunas numéricas
            customer_data[['tenure', 'MonthlyCharges', 'TotalCharges']] = customer_data[['tenure', 'MonthlyCharges', 'TotalCharges']].fillna(customer_data[['tenure', 'MonthlyCharges', 'TotalCharges']].median())

            # Listar colunas binárias e codificá-las
            binary_columns = ['SeniorCitizen', 'Partner', 'Dependents', 'PhoneService', 'PaperlessBilling', 'Contract']
            for col in binary_columns:
                customer_data[col] = LabelEncoder().fit_transform(customer_data[col])

            # Listar colunas categóricas e criar variáveis dummy
            categorical_columns = ['MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies', 'PaymentMethod']
            customer_data = pd.get_dummies(customer_data, columns=categorical_columns)

            # Padronizar as colunas numéricas
            scaler = StandardScaler()
            customer_data[['tenure', 'MonthlyCharges', 'TotalCharges']] = scaler.fit_transform(customer_data[['tenure', 'MonthlyCharges', 'TotalCharges']])

            # Assegurar que todas as colunas necessárias para o modelo estejam presentes
            required_columns = churn_model.feature_names_in_
            missing_cols = set(required_columns) - set(customer_data.columns)
            for col in missing_cols:
                customer_data[col] = 0
            customer_data = customer_data[required_columns]

            # Prever usando o modelo            
            prediction = churn_model.predict(customer_data)
            #return Response({"prediction": prediction.tolist()}, status=status.HTTP_200_OK)
            return Response({'prediction': 'Yes' if prediction[0] == 1 else 'No'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
