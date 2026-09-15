from fastapi import APIRouter, HTTPException
from sources.generator import response
from sources.schema import QuestionsOutput

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]  # Groups routes in automatic Swagger docs
)

@router.get("/")
def get_users():
    return {"status": "active",
      "ready to work": "true"
    }
