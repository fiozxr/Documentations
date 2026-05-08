import os
import glob
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.documents import Document

# For processing images
import base64
from io import BytesIO
from PIL import Image
import google.generativeai as genai

load_dotenv()

# Configure Google API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")

# Configure the older genai package for vision extraction
genai.configure(api_key=api_key)

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

# Use correct model names for gemini based on API version
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
llm = ChatGoogleGenerativeAI(model="gemini-flash-lite-latest", temperature=0.0)

PROMPT_TEMPLATE = """You are Nyay-AI, a highly strict, multi-lingual digital AI assistant and legal expert focusing entirely on Indian Law.
Your single most important rule is to NEVER hallucinate or invent information.
You must ONLY answer based on the provided context below.

Rules:
1. If the answer is not contained in the context, you must clearly state: "I am sorry, but I do not have information about this in my legal database."
2. Do not offer outside legal advice, personal opinions, or general knowledge.
3. Keep your answers factual, concise, and professional.
4. Reply in the language the user asked the question in (e.g., if the user asks in Hindi, reply in Hindi).

Context:
{context}

Question:
{question}

Answer:"""

custom_prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)


def get_vectorstore():
    if os.path.exists(CHROMA_DB_DIR) and os.listdir(CHROMA_DB_DIR):
        print("Loading existing ChromaDB...")
        return Chroma(persist_directory=CHROMA_DB_DIR, embedding_function=embeddings)

    print("No existing ChromaDB found. Creating new one from PDFs in data directory...")
    pdf_files = glob.glob(os.path.join(DATA_DIR, "*.pdf"))

    if not pdf_files:
        print(
            "WARNING: No PDF files found in data directory. The bot will only be able to say it doesn't know."
        )
        dummy_doc = [
            Document(
                page_content="This is a dummy document to initialize the database.",
                metadata={"source": "dummy"},
            )
        ]
        return Chroma.from_documents(
            documents=dummy_doc, embedding=embeddings, persist_directory=CHROMA_DB_DIR
        )

    documents = []
    for pdf_file in pdf_files:
        print(f"Loading {pdf_file}...")
        loader = PyPDFLoader(pdf_file)
        documents.extend(loader.load())

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(documents)

    return Chroma.from_documents(
        documents=splits, embedding=embeddings, persist_directory=CHROMA_DB_DIR
    )


vectorstore = get_vectorstore()


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


def get_rag_chain():
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | custom_prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain


# Initialize chain at startup
try:
    chain = get_rag_chain()
except Exception as e:
    print(f"Failed to initialize chain: {e}")
    chain = None


def query_nyay_ai(question: str) -> str:
    if chain is None:
        return "System error: RAG chain not initialized. Check API keys or database."
    try:
        response = chain.invoke(question)
        return response
    except Exception as e:
        return f"Error connecting to AI: {e}"


def extract_text_from_image(image_path: str) -> str:
    """Uses Gemini vision model to extract text from a legal document image."""
    model = genai.GenerativeModel("gemini-1.5-flash")
    img = Image.open(image_path)
    response = model.generate_content(
        ["Extract all the readable text from this legal document accurately.", img]
    )
    return response.text


def add_document_to_db(file_path: str, ext: str):
    """Processes a new PDF or Image and adds it to the ChromaDB vector store."""
    documents = []
    if ext == ".pdf":
        loader = PyPDFLoader(file_path)
        documents.extend(loader.load())
    elif ext in [".png", ".jpg", ".jpeg"]:
        extracted_text = extract_text_from_image(file_path)
        documents.append(
            Document(page_content=extracted_text, metadata={"source": file_path})
        )
    else:
        raise ValueError("Unsupported file extension")

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(documents)

    # Add to the existing, global vectorstore in memory and persist it
    vectorstore.add_documents(splits)


if __name__ == "__main__":
    print(query_nyay_ai("What is this database about?"))
