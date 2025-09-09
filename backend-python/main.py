# backend-python/main.py
import os
import uuid
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Load environment
load_dotenv()

# ---------------------------
# Logging Config
# ---------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------
# Imports from your project
# ---------------------------
from extraction.extract_pdf import extract_pdf_elements
from summarization.summarize_text_table import summarize_texts, summarize_tables
from summarization.summarize_image import summarize_images
from rag.vector_store import get_vectorstore
from rag.retrieval import setup_retriever, store_documents
from rag.rag_chain import get_rag_chain

# ---------------------------
# Setup
# ---------------------------
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="PaperRAG Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# Vectorstore + retriever
vectorstore = get_vectorstore()
retriever = setup_retriever(vectorstore)

# ---------------------------
# Utilities
# ---------------------------
def error_response(detail: str, status: int = 500):
    logger.error(detail)
    return JSONResponse(status_code=status, content={"error": detail})

# ---------------------------
# Endpoints
# ---------------------------

@app.get("/health")
async def health():
    """Simple health check for serverless deploys"""
    return {"status": "ok"}

@app.post("/ingest")
async def ingest(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_id = uuid.uuid4().hex
    path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    with open(path, "wb") as f:
        f.write(await file.read())

    logger.info(f"[INGEST] Processing file: {file.filename}")

    # 1) Extract elements
    chunks = extract_pdf_elements(path)
    logger.info(f"[INGEST] Extracted {len(chunks)} chunks: {chunks}")
    texts, tables, images = [], [], []
    for chunk in chunks:
        typename = type(chunk).__name__
        if typename == "CompositeElement":
            texts.append(chunk)
            for el in getattr(chunk.metadata, "orig_elements", []):
                et = type(el).__name__
                if et == "Image":
                    if getattr(el.metadata, "image_base64", None):
                        images.append(el.metadata.image_base64)
                elif et == "Table":
                    tables.append(el)

    # 2) Summarize
    text_summaries = summarize_texts([t.text for t in texts]) if texts else []
    table_summaries = summarize_tables([t.metadata.text_as_html for t in tables]) if tables else []
    image_summaries = summarize_images(images) if images else []

    # Check for empty summaries
    if not any([text_summaries, table_summaries, image_summaries]):
        logger.warning("⚠️ No valid summaries to store (all empty).")
        return error_response("No valid summaries to store (all empty).", status=400)

    # 3) Store into vectorstore
    doc_ids = []
    try:
        doc_ids += store_documents(retriever, texts, text_summaries, "text_doc")
        doc_ids += store_documents(retriever, tables, table_summaries, "table_doc")
        doc_ids += store_documents(retriever, images, image_summaries, "image_doc")
    except Exception as e:
        return error_response(f"Vectorstore storage failed: {e}")

    return {
        "status": "ingested",
        "chunks": len(chunks),
        "doc_ids": doc_ids
    }

@app.post("/query")
async def query(payload: dict, request: Request):
    question = payload.get("question", "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")

    logger.info(f"[QUERY] Question: {question}")

    chain = get_rag_chain(retriever)

    try:
        answer = chain.invoke({"question": question})
        # Also fetch retrieved context for traceability
        retrieved = retriever.vectorstore.similarity_search(question, k=3)
        sources = [{"content": d.page_content, "metadata": d.metadata} for d in retrieved]

    except Exception as e:
        return error_response(f"Query failed: {e}")

    return {
        "answer": answer,
        "sources": sources
    }
