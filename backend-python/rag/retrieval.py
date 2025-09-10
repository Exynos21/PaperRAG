# backend-python/rag/retrieval.py
from langchain.storage import InMemoryStore
from langchain.retrievers.multi_vector import MultiVectorRetriever
from langchain.schema import Document
import uuid

def store_documents(retriever, elements, summaries, doc_type):
    """
    Stores elements + summaries into the vectorstore and docstore.
    elements: full objects (text/table/image b64)
    summaries: short summaries (strings) for embeddings
    doc_type: "text" | "table" | "image"
    """
    if not elements or not summaries:
        return []

    ids = [str(uuid.uuid4()) for _ in elements]

    # 1) Create retrievable summary docs
    summary_docs = [
        Document(
            page_content=summaries[i],
            metadata={"doc_id": ids[i], "type": doc_type}
        )
        for i in range(len(summaries))
        if summaries[i] and summaries[i].strip()
    ]

    if not summary_docs:
        print("⚠️ No valid summaries to store (all empty).")
        return []

    # Add summaries to vectorstore
    retriever.vectorstore.add_documents(summary_docs)

    # 2) Store full original elements in docstore
    retriever.docstore.mset([
        (
            ids[i],
            Document(
                page_content=getattr(elements[i], "text", str(elements[i])),
                metadata={"doc_id": ids[i], "type": doc_type}
            )
        )
        for i in range(len(elements))
    ])

    return ids  # ✅ always return a list

def setup_retriever(vectorstore):
    """
    Wraps a vectorstore with MultiVectorRetriever.
    """
    store = InMemoryStore()
    retriever = MultiVectorRetriever(
        vectorstore=vectorstore,
        docstore=store,
        id_key="doc_id",  # must match metadata above
    )
    return retriever
