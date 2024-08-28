# @author Leu A. Manuel
# @see https://github.com/Leupesquisa
# @date 2022-02-22

from rest_framework import serializers

class TrainingSerializer(serializers.Serializer):
    dataset = serializers.ListField(
        child=serializers.DictField()
    )
