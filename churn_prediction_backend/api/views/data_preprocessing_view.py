# @author Leu A. Manuel
# @see https://github.com/Leupesquisa
# (View for preprocessing data analysis)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.serializers.data_preprocessing_serializer import DataPreprocessingSerializer
from core.data_preprocessing import preprocess_dataset
import pandas as pd

class DataPreprocessingView(APIView):
    def post(self, request):
        serializer = DataPreprocessingSerializer(data=request.data)
        if serializer.is_valid():
            df = pd.DataFrame(serializer.validated_data['dataset'])
            results = preprocess_dataset(df)
            
            return Response(results, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
