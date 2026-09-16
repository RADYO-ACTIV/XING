from pydantic import BaseModel, ValidationError, Field, field_validator
from typing import Any, Type, List

class Options(BaseModel):
  option: str=Field(description='options')

class Topicss(BaseModel):
  topic: str=Field(description='topics')

class QuestionStructure(BaseModel):
  question: str=Field(description='question')
  options: List[Options]
  correct: int=Field(description='index of the correct option')
  
class QuestionsOutput(BaseModel):
  questions: List[QuestionStructure]

class InputStructure(Basemodel):
  difficulty: str=Field(description='difficulty level of the generated questions')
  topic: List[Topicss]
  questions: int=Field(description='number of questions to generate')