import RPi.GPIO as GPIO
import time
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import os


# Path to the service account JSON file in the .gac folder
home_directory = os.path.expanduser('~')  # Gets the home directory
gac_folder = os.path.join(home_directory, '.gac', 'serviceAccount.json')  # Construct the full path

# Initialize Firebase using the service account JSON from .gac folder
cred = credentials.Certificate(gac_folder)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://homeautomation-209e4-default-rtdb.europe-west1.firebasedatabase.app/'
})

TRIG_PIN = 16
ECHO_PIN = 20
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG_PIN, GPIO.OUT)
GPIO.setup(ECHO_PIN, GPIO.IN)

ref = db.reference('Distance')

def measure_distance():
    GPIO.output(TRIG_PIN, False)
    time.sleep(2)

    GPIO.output(TRIG_PIN, True)
    time.sleep(0.00001)
    GPIO.output(TRIG_PIN, False)

    pulse_start = time.time()
    pulse_end = time.time()

    while GPIO.input(ECHO_PIN) == 0:
        pulse_start = time.time()

    while GPIO.input(ECHO_PIN) == 1:
        pulse_end = time.time()
    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    distance = round(distance, 2)

    return distance

try:
    print("Masurare distanta. Apasă CTRL+C pentru a opri.")
    while True:
        dist = measure_distance()
        print(f"Distanta: {dist} cm")
        if dist < 20:
            flag = 1
        else:
            flag = 0
        time.sleep(1)  # Așteaptă 1 secundă
        data = {
            'key1': flag,
        }

        ref.set(data)
        time.sleep(2)

except KeyboardInterrupt:
    print("Oprire manuală.")
finally:
    GPIO.cleanup()