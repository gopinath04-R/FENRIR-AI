import os
from pathlib import Path
from uuid import uuid4

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise RuntimeError("HF_TOKEN is missing in backend/.env")

client = InferenceClient(
    provider="auto",
    api_key=HF_TOKEN,
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def generate_image(prompt: str) -> dict[str, str | bool]:
    try:
        image = client.text_to_image(
            prompt=prompt,
            model="black-forest-labs/FLUX.1-schnell",
            width=1024,
            height=1024,
        )

        file_path = UPLOAD_DIR / f"fenrir-{uuid4().hex}.png"
        image.save(file_path)

        return {
            "success": True,
            "image": str(file_path),
        }

    except Exception as error:
        return {
            "success": False,
            "error": str(error),
        }