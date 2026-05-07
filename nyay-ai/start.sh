#!/bin/bash
echo "Starting Nyay-AI Backend..."
cd backend
python main.py &
cd ../frontend
echo "Starting Frontend on port 5000..."
python -m http.server 5000 &
wait
