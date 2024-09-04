from gpiozero import DigitalInputDevice
import time
import firebase_admin
import RPi.GPIO as GPIO
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

GPIO.setmode(GPIO.BCM)
GPIO.setup(12, GPIO.OUT)
GPIO.setup(1, GPIO.OUT)
GPIO.setup(7, GPIO.OUT)
ref = db.reference('Gas Sensor')

Detector_Bucatarie = DigitalInputDevice(6)

while True:
   if Detector_Bucatarie.value == 0:
      print("Gas detectat!")
      GPIO.output(12, GPIO.LOW)
      GPIO.output(1, GPIO.LOW)
      GPIO.output(7, GPIO.LOW)
      flag=1
   else:
      print("Valoare Normala.")
      flag=0
   data = {
            'key3': flag,
        }
        
        # Push data to Firebase Realtime Database
   ref.set(data)
   time.sleep(1)