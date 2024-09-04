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

ref = db.reference('Soil Moisture')
SENSOR_PIN = 5

GPIO.setmode(GPIO.BCM)
GPIO.setup(SENSOR_PIN, GPIO.IN)

def read_sensor():
    return GPIO.input(SENSOR_PIN)

try:
    print("Monitorizare umiditate sol. Apasa CTRL+C pentru a opri.")
    while True:
        sensor_value = read_sensor()
        if sensor_value:
            print("Sol uscat")
            flag = "uscat"
        else:
            print("Sol umed")
            flag = "umed"
        time.sleep(1)
        data = {
            'key4': flag,
        }
        ref.set(data)
except KeyboardInterrupt:
    print("Oprire manuala.")
finally:
    GPIO.cleanup()