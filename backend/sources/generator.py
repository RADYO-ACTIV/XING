import os
import asyncio
from google import genai
from openai import OpenAI
from google.genai import errors, types
from typing import Optional, Dict, Any, Tuple, Type
from pydantic import BaseModel, ValidationError

# The function takes in a prompt and returns response as a json format
class Response:
  default_instruction="Your'e a helpful assistant"
  _gclient = genai.Client()
          
  def __init__(self, question, 
  instructions: Optional[str] = None):
    self.question = question
    self.instructions = instructions or self.default_instruction
  
  def _validate_input(self):
    if not self.question or not self.question.strip():
          raise ValueError("Question parameter cannot be empty")

  async def gemini(self,
  output_schema: Type[BaseModel]
  )-> Tuple[Optional[BaseModel], Optional[Exception]]:
      # Input validation
      try:
        self._validate_input()
      except Exception as e:
        return None, e

      if not issubclass(output_schema, BaseModel):
          return None, ValueError("output_schema must be a Pydantic BaseModel subclass")
  
      # values initialization
      configs = types.GenerateContentConfig(
      system_instruction=(self.instructions),
      response_mime_type="application/json",
      response_schema=output_schema,
  )
      # api calling
      try:
          response = self._gclient.models.generate_content(
              model="gemini-3.6-flash",
              contents=self.question,
              config=configs)
          
          if response.text:
            output = output_schema.model_validate_json(response.text)
            return output, None
          else:
            raise Exception('invalid output')

      except (errors.ClientError, errors.ServerError) as e:
        return None, e
      except Exception as e:
        return None, e
