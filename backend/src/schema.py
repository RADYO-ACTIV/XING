from pydantic import BaseModel, ValidationError, Field, field_validator
from typing import Any, Type, List

class QuestionStructure(BaseModel):
  question: str=Field(description='question')
  options: List[str]
  correct: int=Field(description='index of the correct option')
  
class QuestionsOutput(BaseModel):
  questions: List[QuestionStructure]
