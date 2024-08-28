# @author Leu A. Manuel
# @see https://github.com/Leupesquisa
# @date 2022-02-22
# (Serializer for statistical data requests and model evaluation)

from rest_framework import serializers

class StatisticsSerializer(serializers.Serializer):
    model_type = serializers.ChoiceField(choices=['logistic_regression', 'knn', 'decision_tree', 'random_forest', 'svm'], default='logistic_regression')
    X_test = serializers.ListField(child=serializers.DictField())
    y_test = serializers.ListField(child=serializers.IntegerField())
