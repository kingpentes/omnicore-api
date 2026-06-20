from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import map, dashboard

# Create database tables if they don't exist
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Omnicore API",
    description="FastAPI Migration of Omnicore API",
    version="1.0.0"
)

# CORS Middleware (similar to Slim App CORS setup)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(map.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Omnicore API (FastAPI)"}
