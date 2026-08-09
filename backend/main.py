from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.image import router as image_router
from app.routes.seo import router as seo_router
from app.routes.analytics import router as analytics_router
from app.routes.reports import router as reports_router


app = FastAPI(
    title="FENRIR AI API",
    version="1.0.0",
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Production domain
        "https://fenrir-ai-five.vercel.app",
    ],

    # Allows Vercel preview deployment URLs too
    allow_origin_regex=r"https://.*\.vercel\.app",

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def home():
    return {
        "message": "FENRIR AI Backend is running",
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "fenrir-ai",
    }


# ==========================================
# ROUTERS
# ==========================================

app.include_router(chat_router)
app.include_router(image_router)
app.include_router(seo_router)
app.include_router(analytics_router)
app.include_router(reports_router)