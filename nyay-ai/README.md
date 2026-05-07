# Nyay-AI

Nyay-AI is a multi-language digital AI assistant focused strictly on Indian Law. It uses Retrieval-Augmented Generation (RAG) powered by Google Gemini to process PDF legal documents and provide hallucination-free answers.

## Features
- **Strict Guardrails**: Refuses to answer non-legal questions or anything outside the provided PDFs.
- **Multilingual Voice Capabilities**: Speak to the bot and hear its response in Indian languages using the browser's built-in Web Speech API.
- **Upload Knowledge**: An API endpoint to upload new PDF case files.

## Setup
1. Add your Google API Key to `backend/.env`
2. Run `pip install -r backend/requirements.txt`
3. Add any legal PDFs to the `data/` folder.
4. Run `./start.sh`
5. Open your browser to `http://localhost:5000`

## Tech Stack
- **Backend**: Python, FastAPI, LangChain, ChromaDB
- **Frontend**: HTML, CSS, Vanilla JS
- **AI**: Google Gemini Flash Lite
