import os
from base64 import b64decode
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_community.chat_models import ChatOpenAI
from langchain_groq import ChatGroq


# --------------------------
# ✅ Image Save Utility (optional)
# --------------------------
def save_image_if_relevant(image_b64, folder="saved_images", prefix="matched_image"):
    import uuid
    import pathlib

    try:
        pathlib.Path(folder).mkdir(parents=True, exist_ok=True)
        if "," in image_b64:
            image_b64 = image_b64.split(",")[1]  # strip data URL prefix
        image_data = b64decode(image_b64)
        filename = os.path.join(folder, f"{prefix}_{uuid.uuid4().hex[:8]}.jpg")
        with open(filename, "wb") as f:
            f.write(image_data)
        print(f"[INFO] Saved image: {filename}")
    except Exception as e:
        print(f"[ERROR] Could not save image: {e}")


# --------------------------
# ✅ Preprocessor
# --------------------------
def parse_docs(docs, docstore=None):
    b64, text = [], []
    for doc in docs:
        # if doc is already just a string
        if isinstance(doc, str):
            try:
                b64decode(doc)
                b64.append(doc)
            except Exception:
                text.append(doc)
        else:
            # fetch full doc if only summary was stored
            doc_id = doc.metadata.get("doc_id")
            if doc_id and docstore:
                full_doc = docstore.mget([doc_id])[0]
                if full_doc:
                    content = full_doc.page_content
                    try:
                        b64decode(content)
                        b64.append(content)
                    except Exception:
                        text.append(full_doc)
                else:
                    text.append(doc)
            else:
                text.append(doc)
    return {"images": b64, "texts": text}


# --------------------------
# ✅ Prompt Builder
# --------------------------
def build_prompt(kwargs):
    docs_by_type = kwargs["context"]
    user_question = kwargs["question"]

    context_text = "\n\n".join(
        [t.page_content if hasattr(t, "page_content") else str(t) for t in docs_by_type["texts"]]
    )

    # Basic prompt (can be upgraded later with role instructions)
    prompt = f"""You are an expert research assistant. 
Answer the question using ONLY the provided context. 
If the context is insufficient, say you don't know.

Context:
{context_text}

Question: {user_question}
Answer:"""

    return prompt


# --------------------------
# ✅ Get LLM
# --------------------------
def get_llm():
    provider = os.getenv("LLM_PROVIDER", "groq").lower()
    if provider == "openai":
        return ChatOpenAI(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=0,
        )
    else:
        # default Groq
        return ChatGroq(
            model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
            temperature=0,
        )


# --------------------------
# ✅ RAG Chain (answer only)
# --------------------------
def get_rag_chain(retriever):
    llm = get_llm()

    return (
        {
            "context": RunnableLambda(
                lambda x: retriever.vectorstore.similarity_search(x["question"], k=3)
            )
            | RunnableLambda(parse_docs),
            "question": RunnablePassthrough(),
        }
        | RunnableLambda(build_prompt)
        | llm
        | StrOutputParser()
    )


# --------------------------
# ✅ RAG Chain with sources
# --------------------------
def get_rag_chain_with_sources(retriever):
    llm = get_llm()

    # Step 1: retrieve + parse
    def retrieve_and_parse(input):
        docs = retriever.vectorstore.similarity_search(input["question"], k=3)
        return parse_docs(docs)

    # Step 2: build the answer prompt
    def build_input(inputs):
        context = retrieve_and_parse(inputs)
        prompt = build_prompt({"context": context, "question": inputs["question"]})
        return {"prompt": prompt, "context": context, "question": inputs["question"]}

    # Step 3: format final output with sources
    def format_with_sources(kwargs):
        answer = kwargs["answer"]
        docs_by_type = kwargs.get("context", {"texts": []})
        sources = [
            getattr(t, "page_content", str(t))[:200] for t in docs_by_type.get("texts", [])
        ]
        return {"answer": answer, "sources": sources}

    return (
        RunnableLambda(build_input)
        | {
            "answer": (RunnableLambda(lambda x: x["prompt"]) | llm | StrOutputParser()),
            "context": RunnableLambda(lambda x: x["context"]),
        }
        | RunnableLambda(format_with_sources)
    )
