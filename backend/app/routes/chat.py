from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.chat_service import (
    analyze_uploaded_image,
    generate_chat_reply,
)

router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
)


@router.get("/")
async def chat_status():
    return {
        "service": "Fenrir Chat",
        "status": "online",
    }


@router.post("/")
async def chat_endpoint(payload: dict):
    try:
        message = str(
            payload.get("message", "")
        ).strip()

        language = str(
            payload.get("language", "English")
        ).strip()

        history = payload.get("history", [])

        if not message:
            raise HTTPException(
                status_code=400,
                detail="Message is required.",
            )

        reply = await generate_chat_reply(
            message=message,
            language=language,
            history=history,
        )

        return {
            "success": True,
            "reply": reply,
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc


@router.post("/image")
async def image_analysis_endpoint(
    image: UploadFile = File(...),
    prompt: str = Form("Analyze this image."),
    language: str = Form("English"),
):
    try:
        if not image.content_type:
            raise HTTPException(
                status_code=400,
                detail="Invalid image file.",
            )

        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Only image files are supported.",
            )

        image_bytes = await image.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Image file is empty.",
            )

        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Image must be below 10 MB.",
            )

        reply = await analyze_uploaded_image(
            image_bytes=image_bytes,
            mime_type=image.content_type,
            prompt=prompt,
            language=language,
        )

        return {
            "success": True,
            "reply": reply,
            "filename": image.filename,
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc