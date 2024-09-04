#!/bin/bash

# Function to handle the SIGINT (CTRL+C) signal
cleanup() {
    echo "Terminating all processes..."
    for pid in "${pids[@]}"; do
        kill "$pid" 2>/dev/null
    done
    exit
}

# Trap SIGINT (CTRL+C) and call the cleanup function
trap cleanup SIGINT

# List of Python scripts to run
scripts=("Senzor_Garaj.py" "Sistem_Alarma.py" "Sistem_Gaz.py" "Temperatura_Dormitor.py" "Umiditate_Sol.py" "Lumina_exterior.py")

# Array to hold process IDs
pids=()

# Start each script in the background and store its PID
for script in "${scripts[@]}"; do
    python3 "$script" &
    pids+=($!)
done

# Wait for all background processes to finish
wait