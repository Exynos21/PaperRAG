import time
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

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
model = ChatGroq(temperature=0.5, model="llama-3.1-8b-instant")
summarize_chain = {"element": lambda x: x} | prompt | model | StrOutputParser()

# -----------------------------
# Safe batch summarization
# -----------------------------
def safe_batch(inputs, max_concurrency=1, retry_delay=15, retries=3):
    filtered_inputs = [x for x in inputs if isinstance(x, str) and x.strip()]
    if not filtered_inputs:
        print("⚠️ No valid inputs to summarize.")
        return [""] * len(inputs)

    for attempt in range(retries):
        try:
            summaries = summarize_chain.batch(filtered_inputs, {"max_concurrency": max_concurrency})
            # Map back to original structure
            result = []
            j = 0
            for x in inputs:
                if isinstance(x, str) and x.strip():
                    result.append(summaries[j])
                    j += 1
                else:
                    result.append("")
            return result
        except Exception as e:
            if "rate limit" in str(e).lower():
                print(f"[Rate Limit] Waiting {retry_delay}s... (Attempt {attempt+1}/{retries})")
                time.sleep(retry_delay)
            else:
                raise
    raise Exception("❌ Exceeded retries due to rate limiting.")

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
