import os
from openai import OpenAI
from google.genai import errors, types
from typing import Optional, Dict, Any, Tuple, Type
from pydantic import BaseModel, ValidationError
from google import genai

# The function takes in a prompt and returns response as a json format
class Response:
  default_instruction="Your'e a helpful assistant"
  def __init__(self, question, 
  instructions: Optional[str] = default_instruction):
    self.question = question
    self.instructions = instruction
  
  def _validate_input(self):
    if not self.question or not self.question.strip():
          raise ValueError("Question parameter cannot be empty")
  
  def gemini(self,
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
      config_instruction = self.instructions
      # api calling
      try:
          client = genai.Client()
          interaction = client.interactions.create(
              model="gemini-3.6-flash",
              system_instruction=config_instruction,
              input=self.question,
              response_format={
          "type": "text",
          "mime_type": "application/json",
          "schema": output_schema.model_json_schema()})
          if interaction.output_text:
            output = output_schema.model_validate_json(interaction.output_text)
            return output, None
          else:
            raise Exception('invalid output')

      except (errors.ClientError, errors.ServerError) as e:
        return None, e
      except Exception as e:
        return None, e

  def deepseek_response():
    try:
      self._validate_input()
    except Exception as e:
      return None, e

    try:
      client = OpenAI(
          api_key=os.environ.get('DEEPSEEK_API_KEY'),
          base_url="https://api.deepseek.com")
      
      response = client.chat.completions.create(
          model="deepseek-flash",
          messages=[
              {"role": "system", "content": self.instruction},
              {"role": "user", "content": self.question},
          ],
          stream=False,
          reasoning_effort="high",
          extra_body={"thinking": {"type": "enabled"}}
          response_format={
              'type': 'json_object'
          })
      if response.choices[0].message.content:
        output = response.choices[0].message.content
        return output, None
      else:
        raise Exception("invalid Output")

    except Exception as e:
      return None, e