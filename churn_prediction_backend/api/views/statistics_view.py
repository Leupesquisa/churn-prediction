# @author Leu A. Manuel
# @see https://github.com/Leupesquisa
# (View to calculate and return model performance statistics)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.serializers.statistics_serializer import StatisticsSerializer
from core.machine_learning import ChurnModel
from core.statistics import evaluate_model, get_classification_report, get_confusion_matrix
import pandas as pd

class StatisticsView(APIView):
    def post(self, request):
        serializer = StatisticsSerializer(data=request.data)
        if serializer.is_valid():
            model_type = serializer.validated_data['model_type']
            X_test = pd.DataFrame(serializer.validated_data['X_test'])
            y_test = pd.Series(serializer.validated_data['y_test'])
            
            churn_model = ChurnModel(model_type=model_type)
            y_pred = churn_model.predict(X_test)
            
            evaluation = evaluate_model(y_test, y_pred)
            classification_report = get_classification_report(y_test, y_pred)
            confusion_matrix = get_confusion_matrix(y_test, y_pred)
            
            return Response({
                "evaluation": evaluation,
                "classification_report": classification_report,
                "confusion_matrix": confusion_matrix.tolist()
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
