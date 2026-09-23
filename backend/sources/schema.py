from pydantic import BaseModel, ValidationError, Field, field_validator
from typing import Any, Type, List

class QuestionStructure(BaseModel):
  question: str=Field(description='question')
  options: List[str]=Field(description='list of options')
  correct: int=Field(description='index of the correct option')
  
class QuestionsOutput(BaseModel):
  questions: List[QuestionStructure]

class InputStructure(BaseModel):
  difficulty: str=Field(description='difficulty level of the generated questions')
  topics: List[str]=Field(description='list of topics')
  questions: int=Field(description='number of questions to generate')