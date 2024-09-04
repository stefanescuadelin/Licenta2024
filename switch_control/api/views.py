# from django.shortcuts import render

# Create your views here.

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .gpio_control import turn_on_led, turn_off_led, get_led_status
from .serializers import LEDControlSerializer

@api_view(['POST'])
def control_led(request, led_name):
    serializer = LEDControlSerializer(data=request.data)
    if serializer.is_valid():
        led_status = serializer.validated_data['status']
        if led_status == 'on':
            if turn_on_led(led_name):
                return Response({'message': f'{led_name} turned on'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid LED name'}, status=status.HTTP_400_BAD_REQUEST)
        elif led_status == 'off':
            if turn_off_led(led_name):
                return Response({'message': f'{led_name} turned off'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid LED name'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_led_values(request):
    led_status = get_led_status()
    return Response(led_status, status=status.HTTP_200_OK)
