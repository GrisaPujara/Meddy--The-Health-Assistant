import json
import re

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

from backend.config import GOOGLE_API_KEY
from backend.prompts import (
    SYSTEM_PROMPT,
    GROCERY_PLAN_PROMPT,
    NUTRITION_PLAN_PROMPT,
)


class LLMService:

    def __init__(self):

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=GOOGLE_API_KEY,
            temperature=0.2,
        )

    def answer(self, question: str, context: str):

        prompt = f"""
{SYSTEM_PROMPT}

Medical Context:
{context}

Question:
{question}

Answer:
"""

        response = self.llm.invoke(
            [HumanMessage(content=prompt)]
        )

        return response.content

    def generate_grocery_plan(self, payload: dict) -> dict:
        prompt = GROCERY_PLAN_PROMPT.format(
            payload=json.dumps(payload, ensure_ascii=False, indent=2)
        )
        return self._invoke_json(prompt)

    def generate_nutrition_plan(self, payload: dict) -> dict:
        prompt = NUTRITION_PLAN_PROMPT.format(
            payload=json.dumps(payload, ensure_ascii=False, indent=2)
        )
        return self._invoke_json(prompt)

    def _invoke_json(self, prompt: str) -> dict:
        response = self.llm.invoke([HumanMessage(content=prompt)])
        content = response.content or "{}"
        return self._parse_json(content)

    def _parse_json(self, content: str) -> dict:
        text = content.strip()

        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            raise ValueError("Meddy could not parse the generated plan.")