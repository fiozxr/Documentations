import sys
from rag import get_rag_chain

try:
    chain = get_rag_chain()
    print("Chain loaded successfully!")
except Exception as e:
    print(f"Error loading chain: {e}")
    sys.exit(1)
