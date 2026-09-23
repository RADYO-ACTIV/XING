from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sources import routes

app = FastAPI()

origins = [
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

@app.get("/api")
def read_root():
    return {"status": "success", "message": "FastAPI is running!"}

# Include the router in your main application
app.include_router(routes.router)