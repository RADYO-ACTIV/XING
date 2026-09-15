from fastapi import APIRouter, HTTPException
from sources.generator import response
from sources.schema import InputStructure, QuestionsOutput

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]  # Groups routes in automatic Swagger docs
)

@router.get("/")
def get_users():
    return {"status": "active",
      "ready to work": "true"
    }

@route.post("/")
def generate_questions(params: InputStructure):
    try:
      data, error = response(
      question=params,
      output_schema=QuestionsOutput,)
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