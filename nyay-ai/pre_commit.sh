#!/bin/bash
# Pre-commit checks
set -e

echo "Running Pre-commit Checks..."

# Run tests
echo "1. Running Tests..."
cd backend
python -m pytest test_main.py

echo "2. Checking Python formatting (black)..."
pip install black
black main.py rag.py test_main.py

echo "Pre-commit checks complete!"
