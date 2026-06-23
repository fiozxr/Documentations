from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
import asyncio

# Import our RAG chain and the function to add documents dynamically
from rag import query_nyay_ai, CHROMA_DB_DIR, add_document_to_db

app = FastAPI(title="Nyay-AI Backend", description="Backend for the AI legal assistant")

# Allow CORS for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    reply = query_nyay_ai(request.message)
    return ChatResponse(reply=reply)


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    allowed_extensions = {".pdf", ".png", ".jpg", ".jpeg"}
    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Only PDF and Image files {allowed_extensions} are allowed",
        )

    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    os.makedirs(data_dir, exist_ok=True)
    file_path = os.path.join(data_dir, file.filename)

    def save_file():
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    await asyncio.to_thread(save_file)

    try:
        # Add the document to our Chroma vector store
        await asyncio.to_thread(add_document_to_db, file_path, ext)
        return {"message": f"Successfully processed and learned from {file.filename}."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
