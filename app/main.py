import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models

# ============================================================
# IMPORT ROUTERS
# ============================================================

from app.routers import users
from app.routers import departments
from app.routers import employees
from app.routers import attendance
from app.routers import salary
from app.routers import dashboard
from app.routers import leave


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Employee Management System API",
    version="1.0.0",
    description="Employee Management System built with FastAPI",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

allowed_origins = [
    # Local React frontend
    "http://localhost:5173",

    # Production Vercel frontend
    "https://employee-management-system-alpha-gold.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# STATIC FILES / UPLOADS
# ============================================================

UPLOAD_DIRECTORY = "app/uploads"

os.makedirs(
    UPLOAD_DIRECTORY,
    exist_ok=True
)

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIRECTORY),
    name="uploads"
)


# ============================================================
# INCLUDE ROUTERS
# ============================================================

app.include_router(users.router)
app.include_router(departments.router)
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(salary.router)
app.include_router(dashboard.router)
app.include_router(leave.router)


# ============================================================
# HOME API
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Employee Management System API Running Successfully",
        "version": "1.0.0",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "server": "Running",
    }