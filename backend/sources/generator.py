from typing import Optional, Dict, Any, Tuple, Type
from pydantic import BaseModel, ValidationError
from google import genai
from google.genai import errors, types

# The function takes in a prompt and returns response as a json format
def response(
    question,
    output_schema: Type[BaseModel],
    instructions: Optional[str] = None,
)-> Tuple[Optional[BaseModel], Optional[Exception]]:
    # Input validation
    if not question or not question.strip():
        return None, ValueError("Question parameter cannot be empty")
    if not issubclass(output_schema, BaseModel):
        return None, ValueError("output_schema must be a Pydantic BaseModel subclass")

    # values initialization
    config_instruction = instructions or "You are a helpful AI assistant that provides accurate, structured responses."
    # api calling
    try:
        client = genai.Client(api_key='AIzaSyB3DhodtfUCC0IHXX6IrbQh3o-fTqj4ILk')
        interaction = client.interactions.create(
            model="gemini-3.8-flash",
            system_instruction=config_instruction,
            input=question,
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

