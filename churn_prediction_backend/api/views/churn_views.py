from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import io
import base64
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import roc_curve
from django.http import JsonResponse
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated
from api.models import Customer_Churn
from api.serializers.churn_serializer import CustomerChurnSerializer, RegisterSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from sklearn.metrics import roc_curve, confusion_matrix
from django.db.models import Avg, Count, Q
import numpy as np
from core.machine_learning import ChurnModel
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import roc_curve, confusion_matrix

# Switch Matplotlib backend to 'Agg' to avoid issues with non-GUI environments
plt.switch_backend('Agg')

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

class CustomerChurnViewSet(viewsets.ModelViewSet):
    queryset = Customer_Churn.objects.all()
    serializer_class = CustomerChurnSerializer
    permission_classes = [IsAuthenticated]



# Função para converter strings para float, lidando com valores vazios
def converter_str_float(entrada):
    try:
        return float(entrada)
    except ValueError:
        return np.nan

class ChurnStatisticsView(APIView):
    def get(self, request):
        # Carregar os dados da URL
        url = "https://raw.githubusercontent.com/Leupesquisa/churn-prediction/main/churn_prediction_db.api_customer_churn.json"
        response = requests.get(url)
        data = response.json()

        # Converter para DataFrame
        df = pd.json_normalize(data)

        # Churn Count
        churn_yes_count = df[df['Churn'] == "Yes"].shape[0]
        churn_no_count = df[df['Churn'] == "No"].shape[0]

        # Gender-wise Churn
        male_churn_count = df[(df['Churn'] == "Yes") & (df['gender'] == 'Male')].shape[0]
        female_churn_count = df[(df['Churn'] == "Yes") & (df['gender'] == 'Female')].shape[0]

        # Contract Type Churn
        contract_types = df['Contract'].unique()
        contract_churn_counts = [df[(df['Contract'] == contract) & (df['Churn'] == "Yes")].shape[0] for contract in contract_types]

        # Monthly Charges para clientes com e sem churn
        no_churn_monthly_charges = df[df['Churn'] == "No"]['MonthlyCharges'].mean() or 0
        yes_churn_monthly_charges = df[df['Churn'] == "Yes"]['MonthlyCharges'].mean() or 0

        # Convertendo a coluna TotalCharges de string para float
        df['TotalCharges'] = df['TotalCharges'].apply(converter_str_float)
        total_charges_float = df['TotalCharges'].dropna().tolist()

        # ROC Curve Data
        y_true = np.array([1 if churn == "Yes" else 0 for churn in df['Churn']])
        y_scores = df['MonthlyCharges'].values

        if len(np.unique(y_true)) < 2 or len(np.unique(y_scores)) < 2:
            roc_curve_data = []
        else:
            fpr, tpr, _ = roc_curve(y_true, y_scores)
            roc_curve_data = [{'fpr': float(x), 'tpr': float(y)} for x, y in zip(fpr, tpr)]

        # Confusion Matrix Data
        y_pred = np.array([1 if charge > 50 else 0 for charge in df['MonthlyCharges']])
        cm = confusion_matrix(y_true, y_pred)
        confusion_matrix_data = cm.tolist()

        return Response({
            'churnYesCount': churn_yes_count,
            'churnNoCount': churn_no_count,
            'maleChurnCount': male_churn_count,
            'femaleChurnCount': female_churn_count,
            'contractTypes': list(contract_types),
            'contractChurnCounts': contract_churn_counts,
            'noChurnMonthlyCharges': no_churn_monthly_charges,
            'yesChurnMonthlyCharges': yes_churn_monthly_charges,
            'rocCurveData': roc_curve_data,
            'confusionMatrixData': confusion_matrix_data,
            'totalChargesFloat': total_charges_float,
        }, status=status.HTTP_200_OK)






class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class PredictChurnView(APIView):

    def post(self, request, *args, **kwargs):
        # Use o serviço para carregar o modelo
        model = ChurnModel(model_type='logistic_regression', load_existing=True)
        

        # Receber os dados do cliente
        data = request.data

        # Transformar os dados do cliente em um DataFrame
        customer_data = pd.DataFrame([data])

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
        required_columns = model.feature_names_in_
        missing_cols = set(required_columns) - set(customer_data.columns)
        for col in missing_cols:
            customer_data[col] = 0
        customer_data = customer_data[required_columns]

        # Prever usando o modelo
        prediction = model.predict(customer_data)

        return Response({'prediction': 'Yes' if prediction[0] == 1 else 'No'}, status=status.HTTP_200_OK)
        



class ROCCurveView(APIView):
    def get(self, request, *args, **kwargs):
        churn_data = Customer_Churn.objects.all()
       
        y_true = np.array([1 if customer.Churn == "Yes" else 0 for customer in churn_data])
        y_scores = np.array([customer.MonthlyCharges for customer in churn_data])

        fpr, tpr, _ = roc_curve(y_true, y_scores)

        plt.figure()
        plt.plot(fpr, tpr, color='black')
        plt.plot([0, 1], [0, 1], color='black', linestyle='--')
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)

        image_base64 = base64.b64encode(buf.read()).decode('utf-8')

        return JsonResponse({'roc_curve_image': image_base64}, status=status.HTTP_200_OK)




class ConfusionMatrixView(APIView):
    def get(self, request, *args, **kwargs):
        # Usar ModelService para carregar o modelo
       
        model = ChurnModel(model_type='logistic_regression', load_existing=True)

        # Carregar os dados do banco de dados
        churn_data = list(Customer_Churn.objects.values())
        df = pd.DataFrame(churn_data)

        # Pré-processamento dos dados
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
        df.fillna(df.median(numeric_only=True), inplace=True)  # Preencher valores nulos
        df.drop(columns=['_id', 'customerID', 'gender', 'Churn'], errors='ignore', inplace=True)

        # Codificar colunas binárias
        binary_columns = ['SeniorCitizen', 'Partner', 'Dependents', 'PhoneService', 'PaperlessBilling', 'Contract']
        le = LabelEncoder()
        for col in binary_columns:
            df[col] = le.fit_transform(df[col])

        # Criar variáveis dummy para colunas categóricas
        categorical_columns = ['MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies', 'PaymentMethod']
        df = pd.get_dummies(df, columns=categorical_columns)

        # Padronizar colunas numéricas
        scaler = StandardScaler()
        df[['tenure', 'MonthlyCharges', 'TotalCharges']] = scaler.fit_transform(df[['tenure', 'MonthlyCharges', 'TotalCharges']])

        # Garantir que todas as colunas necessárias para o modelo estejam presentes
        required_columns = model.feature_names_in_
        df = df.reindex(columns=required_columns, fill_value=0)

        # Fazer previsões com o modelo
        y_pred = model.predict(df)

        # Criar y_true a partir dos dados originais
        y_true = np.array([1 if churn == "Yes" else 0 for churn in pd.DataFrame(churn_data)['Churn']])

        # Calcular a matriz de confusão
        cm = confusion_matrix(y_true, y_pred, normalize='all')

        # Configurar o gráfico
        plt.figure(figsize=(16, 14))  # Aumentar o tamanho da figura para maior visibilidade
        sns.heatmap(cm, annot=True, fmt=".2f", cmap="RdYlGn", cbar=True, xticklabels=[0, 1], yticklabels=[0, 1],
                    annot_kws={"size": 18})  # Aumentar o tamanho da fonte dos valores anotados
        plt.xlabel('Predicted label', fontsize=20)  # Aumentar o tamanho da fonte do eixo X
        plt.ylabel('True label', fontsize=20)  # Aumentar o tamanho da fonte do eixo Y
        plt.title('Logistic Regression - Confusion Matrix', fontsize=22)  # Aumentar o tamanho da fonte do título

        # Remover fundo e aumentar o tamanho da fonte
        plt.gcf().set_facecolor('none')
        plt.tight_layout()

        # Salvar a figura em um buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png', transparent=True)
        plt.close()
        buf.seek(0)

        # Converter a figura para uma string base64
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')

        return JsonResponse({'confusion_matrix_image': image_base64}, status=status.HTTP_200_OK)







class TenureDistributionView(APIView):
    def get(self, request, *args, **kwargs):
        # Coletar a distribuição de tenure para churned e non-churned
        churned_tenure = list(Customer_Churn.objects.filter(churn="Yes").values_list('tenure', flat=True))
        non_churned_tenure = list(Customer_Churn.objects.filter(churn="No").values_list('tenure', flat=True))

        return Response({
            'churned_tenure': churned_tenure,
            'non_churned_tenure': non_churned_tenure
        }, status=status.HTTP_200_OK)



class MonthlyChargesDistributionView(APIView):
    def get(self, request, *args, **kwargs):
        # Coletar a distribuição de Monthly Charges para churned e non-churned
        churned_charges = list(Customer_Churn.objects.filter(churn="Yes").values_list('MonthlyCharges', flat=True))
        non_churned_charges = list(Customer_Churn.objects.filter(churn="No").values_list('MonthlyCharges', flat=True))

        return Response({
            'churned_charges': churned_charges,
            'non_churned_charges': non_churned_charges
        }, status=status.HTTP_200_OK)



class CohortAnalysisView(APIView):
    def get(self, request, *args, **kwargs):
        # Coletar os dados de tenure e contar o número de clientes por tenure
        cohort_data = Customer_Churn.objects.values('tenure').annotate(count=Count('customerID'))
        cohort_data = list(cohort_data)

        return Response({'cohort_analysis': cohort_data}, status=status.HTTP_200_OK)




class FeatureImportanceView(APIView):
    def get(self, request, *args, **kwargs):
        # Carregar o modelo do MongoDB
       
        model = ChurnModel(model_type='logistic_regression', load_existing=True)

        # Obter a importância das features (para modelos que suportam feature_importances_)
        feature_importances = model.feature_importances_
        feature_names = model.feature_names_in_

        # Montar os dados para resposta
        feature_importance_data = [{'feature': name, 'importance': float(importance)} for name, importance in zip(feature_names, feature_importances)]

        return Response({'feature_importance': feature_importance_data}, status=status.HTTP_200_OK)










