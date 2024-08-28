# @author Leu A. Manuel
# @see https://github.com/Leupesquisa
# (Serializer for preprocessing data analysis)

from rest_framework import serializers

class DataPreprocessingSerializer(serializers.Serializer):
    dataset = serializers.ListField(
        child=serializers.DictField()
    )
