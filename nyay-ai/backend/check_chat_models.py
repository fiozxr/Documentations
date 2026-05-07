import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
for m in client.models.list():
    if 'generateContent' in getattr(m, 'supported_generation_methods', []):
        print(f"Name: {m.name}")
    elif hasattr(m, 'supported_generation_methods') == False:
         print(f"Name (no gen method prop): {m.name}")
