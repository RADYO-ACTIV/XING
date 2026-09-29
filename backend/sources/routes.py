from fastapi import APIRouter, HTTPException
import asyncio
from sources.generator import Response
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
async def generate_questions(params: InputStructure):
    n = params.questions
    parts = [c for c in (n // 3 + (i < n % 3) for i in range(3)) if c]

    try:
      results = await asyncio.gather(*[
        Response(
          question=f"topics:{params.topics}, difficulty:{params.difficulty}, no_of_questions:{c}",
          instructions=instruction,
            ).gemini(QuestionsOutput)
        for c in parts
        ])

      questions = []
      for data, error in results:
        if error:
          raise HTTPException(502, detail=str(error))
        questions += data.questions
      return {"status": "success", "data": {"questions": questions}}
      
    except HTTPException as exc:
      raise exc
    except Exception:
      raise HTTPException(status_code=500, detail="an unknown error occurred")