import base64
import os
from typing import Any

from dotenv import load_dotenv
from huggingface_hub import InferenceClient


# =========================================================
# LOAD ENVIRONMENT
# =========================================================

load_dotenv()


HF_TOKEN = (
    os.getenv("HF_TOKEN")
    or os.getenv("HUGGINGFACE_TOKEN")
    or os.getenv("HUGGING_FACE_TOKEN")
)


CHAT_MODEL = os.getenv(
    "CHAT_MODEL",
    "Qwen/Qwen2.5-7B-Instruct",
)


VISION_MODEL = os.getenv(
    "VISION_MODEL",
    "Qwen/Qwen3.5-27B",
)


# =========================================================
# HUGGING FACE CLIENT
# =========================================================

def get_client() -> InferenceClient:
    if not HF_TOKEN:
        raise RuntimeError(
            "HF_TOKEN missing. Add a valid token in backend/.env"
        )

    return InferenceClient(
        provider="auto",
        api_key=HF_TOKEN,
    )


# =========================================================
# LANGUAGE HANDLING
# =========================================================

def language_instruction(
    language: str = "English",
) -> str:
    lang = (
        language or "English"
    ).strip().lower()

    instructions = {
        "english": (
            "Reply naturally in English."
        ),

        "auto detect": (
            "Detect the language used in the user's latest message "
            "and reply naturally in that language."
        ),

        "tamil": (
            "Reply naturally in Tamil."
        ),

        "tanglish": (
            "Reply naturally in Tanglish. "
            "Use conversational Tamil written mainly using English letters."
        ),

        "hindi": (
            "Reply naturally in Hindi."
        ),

        "malayalam": (
            "Reply naturally in Malayalam."
        ),

        "telugu": (
            "Reply naturally in Telugu."
        ),

        "kannada": (
            "Reply naturally in Kannada."
        ),

        "chinese": (
            "Reply naturally in Chinese."
        ),

        "japanese": (
            "Reply naturally in Japanese."
        ),

        "korean": (
            "Reply naturally in Korean."
        ),

        "french": (
            "Reply naturally in French."
        ),

        "german": (
            "Reply naturally in German."
        ),

        "spanish": (
            "Reply naturally in Spanish."
        ),

        "arabic": (
            "Reply naturally in Arabic."
        ),
    }

    return instructions.get(
        lang,
        "Reply naturally in English."
    )


# =========================================================
# SYSTEM PROMPT
# =========================================================

SYSTEM_PROMPT = """
You are Fenrir AI, a modern intelligent conversational assistant.

Capabilities:
- General conversation
- Programming
- Debugging
- Coding help
- Study assistance
- Writing
- Planning
- Brainstorming
- Technical support
- General knowledge
- Multilingual conversation

Rules:
- Answer the user's request directly.
- Do not repeatedly introduce yourself.
- Keep conversation natural.
- Be concise by default.
- Give detailed answers when needed.
- Use Markdown when useful.
- For code, use proper fenced code blocks.
- Preserve useful recent conversation context.
- Never invent previous conversation details.
- If uncertain, say so clearly.
""".strip()


# =========================================================
# VISION PROMPT
# =========================================================

VISION_SYSTEM_PROMPT = """
You are Fenrir AI Vision.

Carefully inspect the image supplied by the user.

You can analyze:
- Photos
- Screenshots
- People
- Objects
- Software errors
- Code screenshots
- Documents
- Visible text
- Charts
- Diagrams
- User interfaces
- Study questions
- Product images
- General scenes

Rules:
- Analyze only what is actually visible.
- Never invent visual details.
- If text is unclear, say so.
- If the user asks for a count, carefully count visible items.
- If the image contains an error, explain the likely issue and solution.
- If it contains code, explain or correct it when useful.
- Follow the selected response language.
- Keep the response clear and useful.
""".strip()


# =========================================================
# CLEAN HISTORY
# =========================================================

def clean_history(
    history: list[dict[str, Any]] | None,
) -> list[dict[str, str]]:
    if not history:
        return []

    cleaned: list[dict[str, str]] = []

    for item in history[-20:]:
        role = str(
            item.get("role", "")
        ).strip()

        text = str(
            item.get(
                "text",
                item.get(
                    "content",
                    "",
                ),
            )
        ).strip()

        if role not in {
            "user",
            "assistant",
        }:
            continue

        if not text:
            continue

        cleaned.append(
            {
                "role": role,
                "content": text,
            }
        )

    return cleaned


# =========================================================
# NORMAL TEXT CHAT
# =========================================================

async def generate_chat_reply(
    message: str,
    language: str = "English",
    history: list[dict[str, Any]] | None = None,
) -> str:
    clean_message = (
        message or ""
    ).strip()

    if not clean_message:
        raise ValueError(
            "Message cannot be empty."
        )

    client = get_client()

    system_content = (
        SYSTEM_PROMPT
        + "\n\nLanguage instruction:\n"
        + language_instruction(language)
    )

    messages: list[dict[str, Any]] = [
        {
            "role": "system",
            "content": system_content,
        }
    ]

    messages.extend(
        clean_history(history)
    )

    messages.append(
        {
            "role": "user",
            "content": clean_message,
        }
    )

    try:
        response = client.chat_completion(
            model=CHAT_MODEL,
            messages=messages,
            max_tokens=1400,
            temperature=0.55,
            top_p=0.9,
        )

        if not response:
            raise RuntimeError(
                "No response received from chat model."
            )

        if not response.choices:
            raise RuntimeError(
                "Chat model returned no choices."
            )

        answer = (
            response
            .choices[0]
            .message
            .content
        )

        if not answer:
            raise RuntimeError(
                "Chat model returned an empty response."
            )

        return str(answer).strip()

    except Exception as exc:
        raise RuntimeError(
            f"Chat model error: {exc}"
        ) from exc


# =========================================================
# IMAGE ANALYSIS
# =========================================================

async def analyze_uploaded_image(
    image_bytes: bytes,
    mime_type: str,
    prompt: str = "",
    language: str = "English",
) -> str:
    if not image_bytes:
        raise ValueError(
            "Image file is empty."
        )

    if not mime_type:
        mime_type = "image/jpeg"

    if not mime_type.startswith(
        "image/"
    ):
        raise ValueError(
            "Invalid image type."
        )

    client = get_client()

    encoded_image = (
        base64.b64encode(
            image_bytes
        ).decode("utf-8")
    )

    image_data_url = (
        f"data:{mime_type};base64,"
        f"{encoded_image}"
    )

    clean_prompt = (
        prompt or ""
    ).strip()

    if not clean_prompt:
        clean_prompt = (
            "Analyze this image carefully and explain what you see."
        )

    system_content = (
        VISION_SYSTEM_PROMPT
        + "\n\nLanguage instruction:\n"
        + language_instruction(language)
    )

    try:
        response = client.chat_completion(
            model=VISION_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": system_content,
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_data_url
                            },
                        },
                        {
                            "type": "text",
                            "text": clean_prompt,
                        },
                    ],
                },
            ],
            max_tokens=1400,
            temperature=0.25,
            top_p=0.9,
        )

        if not response:
            raise RuntimeError(
                "No response received from vision model."
            )

        if not response.choices:
            raise RuntimeError(
                "Vision model returned no choices."
            )

        answer = (
            response
            .choices[0]
            .message
            .content
        )

        if not answer:
            raise RuntimeError(
                "Vision model returned an empty response."
            )

        return str(answer).strip()

    except Exception as exc:
        raise RuntimeError(
            f"Image analysis error: {exc}"
        ) from exc