from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from pymongo.errors import ConnectionFailure
from core.mongodb_service import ModelStorageService  # Importa o serviço MongoDB

class PredictChurnView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.get("customer_data")
        model_name = request.data.get("model_type", "logistic_regression")  # Defina o modelo padrão
        model_abbr = self.get_model_abbr(model_name)  # Obtém a abreviação do modelo
        full_model_name = f"model_{model_abbr}"  # Nome completo do modelo

        try:
            mongodb_service = MongoDBService()
            model = mongodb_service.load_model(full_model_name)  # Carrega o modelo do MongoDB
            prediction = model.predict([data])
            mongodb_service.close_connection()
            return Response({"prediction": prediction[0]}, status=status.HTTP_200_OK)
        except ConnectionFailure:
            return Response({"error": "Failed to connect to MongoDB."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValueError:
            return Response({"error": "Model not found in the database."}, status=status.HTTP_404_NOT_FOUND)

    def get_model_abbr(self, model_name):
        abbreviations = {
            "logistic_regression": "lr",
            "decision_tree": "dt",
            "random_forest": "rf",
            "svm": "svm"
        }
        return abbreviations.get(model_name, "unknown")

class TrainModelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.get("dataset")
        X_train = [d["features"] for d in data]
        y_train = [d["label"] for d in data]
        model_type = request.data.get("model_type", "logistic_regression")

        model = self.get_model_instance(model_type)

        if not model:
            return Response({"error": "Model type not supported."}, status=status.HTTP_400_BAD_REQUEST)

        # Treinando o modelo
        model.fit(X_train, y_train)

        # Salvar o modelo no MongoDB
        try:
            mongodb_service = MongoDBService()
            model_abbr = self.get_model_abbr(model_type)  # Obtém a abreviação do modelo
            full_model_name = f"model_{model_abbr}"  # Nome completo do modelo
            mongodb_service.save_model(model, full_model_name)
            mongodb_service.close_connection()
            return Response({"message": f"Model {model_type} trained and saved successfully!"}, status=status.HTTP_200_OK)
        except ConnectionFailure:
            return Response({"error": "Failed to connect to MongoDB."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_model_instance(self, model_type):
        if model_type == "logistic_regression":
            return LogisticRegression()
        elif model_type == "decision_tree":
            return DecisionTreeClassifier()
        elif model_type == "random_forest":
            return RandomForestClassifier()
        elif model_type == "svm":
            return SVC()
        return None

    def get_model_abbr(self, model_name):
        abbreviations = {
            "logistic_regression": "lr",
            "decision_tree": "dt",
            "random_forest": "rf",
            "svm": "svm"
        }
        return abbreviations.get(model_name, "unknown")
