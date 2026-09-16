from fastapi import APIRouter, HTTPException
from sources.generator import response
from sources.schema import InputStructure, QuestionsOutput

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]  # Groups routes in automatic Swagger docs
)
instruction='''You are supplied with a set of topics, difficulty level and the number of questions to generate. As an expert educational content designer and question-writer. Produce exactly the requested number of multiple-choice questions for the supplied topic at the supplied difficulty level, using the exact schema below (no extra text, no commentary, only valid JSON):

[
{
"question": "Question text here",
"options": ["Option A", "Option B", "Option C", "Option D"],
"correct": 2
},
...
]

STRICT RULES:
1. Schema: Each object must have keys "question" (string), "options" (array of 4 strings), and "correct" (integer). Use zero-based indexing for "correct" (0..3).

2. Output: Emit only the JSON array. Do not include any extraneous text, code fences, explanations, or metadata.

3. Difficulty: All questions should be the selected difficulty level

4. Diversity: Cover only the supplied range of domains (do not involve any concept or topic outside that unless completely necessary).

5. Distractors: Each option must be plausible and homogeneous (same category/type). Distractors must be believable but incorrect; avoid obvious giveaways like "All of the above".

6. Correctness: Ensure the "correct" index accurately points to the true answer. Validate internally before outputting.

7. Uniqueness: Questions and options must be unique (no near-duplicates) and not repeat phrasing.

8. Clarity: Wording must be precise and unambiguous; avoid multi-part or poorly scoped stems.

9. Sourcing: Do not include citations in the JSON, but ensure factual accuracy to the best of your ability (avoid speculative claims).


Most important of all, make sure the answers do not follow any sort of pattern and should be randomly placed in the array'''

@router.get("/")
def get_users():
    return {"status": "active",
      "ready to work": "true"}

@router.post("/")
def generate_questions(params: InputStructure):
    try:
      data, error = response(
      question=params,
      output_schema=QuestionsOutput,
      instructions=instruction)
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