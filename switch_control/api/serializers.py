from rest_framework import serializers

class LEDControlSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['on', 'off'])
