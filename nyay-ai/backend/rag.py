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

load_dotenv()

# Configure Google API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

# Use correct model names for gemini based on API version
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
llm = ChatGoogleGenerativeAI(model="gemini-flash-lite-latest", temperature=0.0)

# Workaround for the embedding model issue - using text-embedding-004 via GoogleGenerativeAIEmbeddings
# Langchain's GoogleGenerativeAIEmbeddings seems to require 'models/gemini-embedding-001'

# 1. Very strict system prompt tailored for a hallucination-free legal assistant
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
        from langchain_core.documents import Document

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


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


def get_rag_chain():
    vectorstore = get_vectorstore()
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


if __name__ == "__main__":
    print(query_nyay_ai("What is this database about?"))
