from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src import routes

app = FastAPI()

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:5500",
    "http://localhost:8158",
    "https://t.com",
    "http://localhost:5173"
    
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include the router in your main application
app.include_router(routes.router)