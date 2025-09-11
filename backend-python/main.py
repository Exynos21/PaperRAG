# backend-python/main.py
import os
import uuid
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

load_dotenv()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Project imports
from extraction.extract_pdf import extract_pdf_elements
from summarization.summarize_text_table import summarize_texts, summarize_tables
from summarization.summarize_image import summarize_images
from rag.vector_store import get_vectorstore
from rag.retrieval import setup_retriever, store_documents
from rag.rag_chain import get_rag_chain, get_rag_chain_with_sources

# Setup
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="PaperRAG Backend (ML only)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Vectorstore + retriever
vectorstore = get_vectorstore()
retriever = setup_retriever(vectorstore)


def error_response(detail: str, status: int = 500):
    logger.error(detail)
    return JSONResponse(status_code=status, content={"error": detail})


@app.get("/health")
async def health():
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

    # 1) Extract
    chunks = extract_pdf_elements(path)
    logger.info(f"[INGEST] Extracted {len(chunks)} chunks")
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

    if not any([text_summaries, table_summaries, image_summaries]):
        logger.warning("⚠️ No valid summaries to store (all empty).")
        return error_response("No valid summaries to store (all empty).", status=400)

    # 3) Store into vectorstore (with file metadata)
    doc_ids = []
    try:
        meta = {"fileName": file.filename}
        doc_ids += store_documents(retriever, texts, text_summaries, "text_doc", meta)
        doc_ids += store_documents(retriever, tables, table_summaries, "table_doc", meta)
        doc_ids += store_documents(retriever, images, image_summaries, "image_doc", meta)
    except Exception as e:
        return error_response(f"Vectorstore storage failed: {e}")

    return {"status": "ingested", "chunks": len(chunks), "doc_ids": doc_ids, "fileName": file.filename}


@app.post("/query")
async def query(payload: dict, request: Request):
    """
    Stateless query. Accepts:
      { question: string, context?: string, fileName?: string }
    """
    question = (payload.get("question") or "").strip()
    context_text = (payload.get("context") or "").strip()
    file_name = (payload.get("fileName") or "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")

    chain_input_question = f"{context_text}\nUser: {question}" if context_text else question
    logger.info(f"[QUERY] Q: {question} (fileName={file_name or 'ALL'})")

    try:
        chain = get_rag_chain(retriever)

        # Apply file filter if provided
        search_kwargs = {"k": 3}
        if file_name:
            search_kwargs["filter"] = {"fileName": file_name}

        retrieved = retriever.vectorstore.similarity_search(question, **search_kwargs)
        answer = chain.invoke({"question": chain_input_question, "context": [d.page_content for d in retrieved]})
        sources = [{"content": d.page_content, "metadata": d.metadata} for d in retrieved]
    except Exception as e:
        return error_response(f"Query failed: {e}")

    return {"answer": str(answer), "sources": sources}


@app.post("/query_with_sources")
async def query_with_sources(payload: dict, request: Request):
    """
    Same as /query but uses get_rag_chain_with_sources which may return sources in-chain.
    Accepts: { question: string, context?: string, fileName?: string }
    """
    question = (payload.get("question") or "").strip()
    context_text = (payload.get("context") or "").strip()
    file_name = (payload.get("fileName") or "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")

    chain_input_question = f"{context_text}\nUser: {question}" if context_text else question
    logger.info(f"[QUERY_WITH_SOURCES] Q: {question} (fileName={file_name or 'ALL'})")

    try:
        chain = get_rag_chain_with_sources(retriever)

        search_kwargs = {"k": 3}
        if file_name:
            search_kwargs["filter"] = {"fileName": file_name}

        result = chain.invoke({"question": chain_input_question})
        if isinstance(result, dict):
            answer = result.get("answer", "")
            sources = result.get("sources", [])
        else:
            answer = str(result)
            retrieved = retriever.vectorstore.similarity_search(question, **search_kwargs)
            sources = [{"content": d.page_content, "metadata": d.metadata} for d in retrieved]
    except Exception as e:
        return error_response(f"Query_with_sources failed: {e}")

    return {"answer": str(answer), "sources": sources}
