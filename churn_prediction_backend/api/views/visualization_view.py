# @author Leu A. Manuel
# @see https://github.com/Leupesquisa

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.serializers.visualization_serializer import VisualizationSerializer
from core.machine_learning import ChurnModel
from core.visualization import plot_confusion_matrix, plot_roc_curve
from core.statistics import get_confusion_matrix, get_roc_curve
from api.models import Customer_Churn
import numpy as np
import pandas as pd

class VisualizationView(APIView):
    def get(self, request, *args, **kwargs):
        # Carregar os dados do banco de dados
        churn_data = list(Customer_Churn.objects.values())
        df = pd.DataFrame(churn_data)

        serializer = VisualizationSerializer(data=churn_data)
        if serializer.is_valid():
            model_type = serializer.validated_data['model_type']
            churn_model = ChurnModel(model_type=model_type, load_existing=True)

            X_test = request.data.get('X_test')
            y_test = request.data.get('y_test')
            y_pred = churn_model.predict(X_test)
            
            matrix = get_confusion_matrix(y_test, y_pred)
            confusion_matrix_img = plot_confusion_matrix(matrix)
            
            fpr, tpr, roc_auc = get_roc_curve(y_test, y_pred)
            roc_curve_img = plot_roc_curve(fpr, tpr)
            
            return Response({
                "confusion_matrix": confusion_matrix_img,
                "roc_curve": roc_curve_img
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
