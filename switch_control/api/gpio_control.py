import RPi.GPIO as GPIO

# Setup GPIO mode
GPIO.setmode(GPIO.BCM)

# Define GPIO pins for LEDs
LED_PINS = {
    'led1': 12,
    'led2': 1,
    'led3': 7,
    'led4': 8,
    'led5': 25
}

for pin in LED_PINS.values():
    GPIO.setup(pin, GPIO.OUT)
def turn_on_led(led_name):
    pin = LED_PINS.get(led_name)
    if pin is not None:
        GPIO.output(pin, GPIO.HIGH)
        return True
    else:
        GPIO.output(pin, GPIO.LOW)
        return True
    return False

def turn_off_led(led_name):
    pin = LED_PINS.get(led_name)
    if pin is not None:
        GPIO.output(pin, GPIO.LOW)
        return True
    else:
        GPIO.output(pin, GPIO.HIGH)
        return True
    return False

def get_led_status():
    status = {}
    for led_name, pin in LED_PINS.items():
        pin_state = GPIO.input(pin)
        status[led_name] = 'on' if pin_state == GPIO.HIGH else 'off'
    return status
