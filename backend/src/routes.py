from fastapi import APIRouter, HTTPException
from generator import response
from schema import QuestionsOutput

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]  # Groups routes in automatic Swagger docs
)

@router.get("/")
def get_users():
    return {"status": "active",
      "ready to work": "true"
    }

@router.post("/{track}")
def get_user(track: str, difficulty: str):
  prompt=f'generate questions on {track} with difficulty level {difficulty or 'mixed'}'
  
  try:
    result, error = response(question=prompt, output_schema=QuestionOutput, instructions=None)
    if data:
      return{
      "status": "success",
      "data": data}
    elif error:
      raise HTTPException(
        status_code=getattr(error, "code", 440),
        detail={
          "status_code": getattr(error, "code", 440),
          "message": getattr(error, "message", str(error))
          })
  
  except HTTPException as exc:
    raise exc
  
  except Exception as err:
    raise HTTPException(
      status_code=500,
      detail="an unknown error occoured")
    