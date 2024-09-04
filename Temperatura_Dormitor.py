# Complete Project Details: https://RandomNerdTutorials.com/raspberry-pi-dht11-dht22-python/
# Based on Adafruit_CircuitPython_DHT Library Example
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import RPi.GPIO as GPIO
import time
import board
import adafruit_dht
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
GPIO.cleanup()
# Reference to the database
ref = db.reference('Temperature')
dhtDevice = adafruit_dht.DHT22(board.D14)  # Utilizează GPIO4 (Pinul D4)

while True:
    try:
        # Citim temperatura și umiditatea
        temperature = dhtDevice.temperature
        humidity = dhtDevice.humidity

        # Afișăm valorile citite
        print(f'Temperatura: {temperature:.1f}°C  Umiditate: {humidity:.1f}%')

        time.sleep(2.0)
        data = {
                'key2': temperature,
            }
                    # Push data to Firebase Realtime Database
        ref.set(data)
    except RuntimeError as error:

        print(f'Eroare la citirea datelor: {error.args[0]}')
        time.sleep(2.0)
        continue

    except Exception as error:
        dhtDevice.exit()
        GPIO.cleanup()
        raise error

    time.sleep(2.0)