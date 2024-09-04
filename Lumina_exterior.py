from gpiozero import MotionSensor
import RPi.GPIO as GPIO
import time
from signal import pause



afara = MotionSensor(22)
GPIO.setmode(GPIO.BCM)


led_pin = 21
GPIO.setup(led_pin, GPIO.OUT)

def afara_detectie():
    print("Detectie Afara")
    GPIO.output(led_pin, GPIO.HIGH)
    time.sleep(5) 
    
def afara_nondetectie():
    print("Nicio Detectie In Afara")
    GPIO.output(led_pin, GPIO.LOW)

afara.when_motion = afara_detectie
afara.when_no_motion = afara_nondetectie

pause()