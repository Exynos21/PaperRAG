import os
import base64
import requests
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("PERPLEXITY_API_KEY")
API_URL = "https://api.perplexity.ai/chat/completions"

# -----------------------------
# Image encode/decode utils
# -----------------------------
def decode_base64_to_image(image_b64):
    image_data = base64.b64decode(image_b64)
    return Image.open(BytesIO(image_data)).convert("RGB")

def encode_image_to_base64(image: Image.Image):
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

# -----------------------------
# Single image summarization
# -----------------------------
def get_image_summary(image_base64):
    try:
        image = decode_base64_to_image(image_base64)
        encoded_image = encode_image_to_base64(image)

        payload = {
            "model": "sonar",
            "messages": [
                {"role": "user", "content":[
                    {"type":"image_url", "image_url":{"url": f"data:image/jpeg;base64,{encoded_image}"}},
                    {"type":"text", "text":"Summarize this image briefly."}
                ]}
            ]
        }

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            return f"❌ Error {response.status_code}: {response.text}"

    except Exception as e:
        return f"⚠️ Exception occurred: {str(e)}"

# -----------------------------
# Batch summarization
# -----------------------------
def summarize_images(images_base64):
    return [get_image_summary(img_b64) for img_b64 in images_base64]
