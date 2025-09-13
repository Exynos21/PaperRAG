# backend-python/rag/vector_store.py

import os

PERSIST_DIR = os.getenv("CHROMA_DB_DIR", "./chroma_db")

def get_vectorstore():
    from langchain_chroma import Chroma
    from langchain_huggingface import HuggingFaceEmbeddings
    """
    Returns a persistent Chroma vectorstore with HuggingFace embeddings.
    Persists automatically so data survives restarts.
    """
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    vectorstore = Chroma(
        collection_name="paper_rag_collection",
        embedding_function=embeddings,
        persist_directory=PERSIST_DIR,
    )
    return vectorstore
