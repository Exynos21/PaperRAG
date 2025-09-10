import time
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

import os
print("Groq Key:", os.getenv("GROQ_API_KEY"))

# -----------------------------
# Setup summarization chain
# -----------------------------
prompt_text = """
You are an AI assistant tasked with summarizing tables or text.
Summarize concisely, in plain English.
Respond ONLY with the summary, no extra comments.

Content:
{element}
"""

prompt = ChatPromptTemplate.from_template(prompt_text)
model = ChatGroq(
    temperature=0.5,
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY")  # <- force inject
)

summarize_chain = {"element": lambda x: x} | prompt | model | StrOutputParser()

# -----------------------------
# Safe batch summarization
# -----------------------------
def safe_batch(inputs, batch_size=1, retry_delay=20, retries=3):
    """
    Summarize inputs in smaller batches to avoid hitting Groq's rate limits.
    """
    filtered_inputs = [x for x in inputs if isinstance(x, str) and x.strip()]
    if not filtered_inputs:
        print("⚠️ No valid inputs to summarize.")
        return [""] * len(inputs)

    results = []
    for i in range(0, len(filtered_inputs), batch_size):
        chunk = filtered_inputs[i:i+batch_size]
        for attempt in range(retries):
            try:
                summaries = summarize_chain.batch(chunk, {"max_concurrency": 1})
                results.extend(summaries)
                break  # success, break retry loop
            except Exception as e:
                print(f"❌ Summarization error: {e}")
                if "rate limit" in str(e).lower() or "429" in str(e):
                    print(f"[Rate Limit] Waiting {retry_delay}s... (Attempt {attempt+1}/{retries})")
                    time.sleep(retry_delay)
                else:
                    raise
        else:
            raise Exception("❌ Exceeded retries for summarization.")
    return results


# -----------------------------
# Exported functions
# -----------------------------
def summarize_texts(texts):
    # Convert CompositeElement -> text
    texts_str = [getattr(t, "text", str(t)) if not isinstance(t, str) else t for t in texts]
    return safe_batch(texts_str)

def summarize_tables(tables_html):
    # Convert CompositeElement -> HTML string
    tables_str = [getattr(t.metadata, "text_as_html", str(t)) if not isinstance(t, str) else t for t in tables_html]
    return safe_batch(tables_str)
