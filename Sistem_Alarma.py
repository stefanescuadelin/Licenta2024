import time
import RPi.GPIO as GPIO
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import os

# Configurare Firebase
# Path to the service account JSON file in the .gac folder
home_directory = os.path.expanduser('~')  # Gets the home directory
gac_folder = os.path.join(home_directory, '.gac', 'serviceAccount.json')  # Construct the full path

# Initialize Firebase using the service account JSON from .gac folder
cred = credentials.Certificate(gac_folder)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://homeautomation-209e4-default-rtdb.europe-west1.firebasedatabase.app/'
})


ref = db.reference('Alarma')

LIVING = 26  # Pinul GPIO la care este conectat OUT-ul senzorului PIR
BUCATARIE = 18
DORMITOR = 27
GPIO.setmode(GPIO.BCM)  # Setează modul de numerotare al pinilor (BCM)
GPIO.setup(BUCATARIE, GPIO.IN)
GPIO.setup(DORMITOR, GPIO.IN)
GPIO.setup(LIVING, GPIO.IN)
print("Senzorul PIR este pornit si în asteptarea miscarii...")
flag = 0
try:
    while True:
        count = 0
        if GPIO.input(LIVING):
            print("Miscare detectată!")
            count = 1
        else:
            print("Nicio miscare.")

        
        if GPIO.input(BUCATARIE):
            print("Miscare detectată!")
            count = 1
        else:
            print("Nicio miscare.")
        if GPIO.input(DORMITOR):
            print("Miscare detectată!")
            count = 1
        else:
            print("Nicio miscare.")

        
        if count == 0:
            flag = 0
        else:
            flag = 1
        print(flag)
        count = 0

        data = {
            'key5': flag
        }
        # Push data to Firebase Realtime Database
        ref.set(data)
        time.sleep(2)
except KeyboardInterrupt:
    print("Program oprit de utilizator")
finally:
    GPIO.cleanup() 