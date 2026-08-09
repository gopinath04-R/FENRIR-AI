from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from app.services.image_service import generate_image as generate_ai_image

router = APIRouter()


class ImageRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=1000)
    width: int = Field(default=1024, ge=256, le=1536)
    height: int = Field(default=1024, ge=256, le=1536)
    style: str = Field(default="Cinematic", max_length=100)


@router.get("/")
def image_status() -> dict[str, str]:
    return {
        "module": "Fenrir Real AI Image Engine",
        "status": "online",
    }


@router.post("/generate")
def generate_image(request: ImageRequest) -> FileResponse:
    prompt = request.prompt.strip()
    style = request.style.strip()

    if not prompt:
        raise HTTPException(
            status_code=400,
            detail="Image prompt is required.",
        )

    enhanced_prompt = (
        f"{prompt}, {style} style, high quality, detailed, "
        "professional composition, sharp focus"
    )

    result = generate_ai_image(enhanced_prompt)

    if not result.get("success"):
        raise HTTPException(
            status_code=500,
            detail=result.get(
                "error",
                "Hugging Face image generation failed.",
            ),
        )

    image_path = Path(result["image"]).resolve()

    if not image_path.exists():
        raise HTTPException(
            status_code=500,
            detail="Generated image file was not found.",
        )

    return FileResponse(
        path=str(image_path),
        media_type="image/png",
        filename="fenrir-ai-image.png",
    )