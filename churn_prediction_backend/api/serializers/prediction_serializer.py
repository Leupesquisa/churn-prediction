# @author Leu A. Manuel
# @see https://github.com/Leupesquisa
# @date 2022-02-22

from rest_framework import serializers

class PredictionSerializer(serializers.Serializer):
    customer_data = serializers.DictField()
    model_type = serializers.ChoiceField(choices=['logistic_regression', 'knn', 'decision_tree', 'random_forest', 'svm'], default='logistic_regression')
