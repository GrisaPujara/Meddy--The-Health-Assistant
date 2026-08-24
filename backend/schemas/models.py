from typing import Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[int]


class FamilyMember(BaseModel):
    role: str
    name: str = ""
    age: Optional[int] = None
    gender: str = ""
    medicalConditions: str = ""
    included: bool = True


class GroceryPlanRequest(BaseModel):
    country: str = "India"
    state: str = ""
    city: str = ""
    pinCode: str = ""
    budget: float
    foodPreference: str = "Vegetarian"
    members: list[FamilyMember] = Field(default_factory=list)


class NutritionPlanRequest(BaseModel):
    country: str = "India"
    state: str = ""
    city: str = ""
    pinCode: str = ""
    budget: float
    foodPreference: str = "Vegetarian"
    goal: str = "Weight Stability"
    age: Optional[int] = None
    gender: str = ""
    height: Optional[float] = None
    weight: Optional[float] = None
    activityLevel: str = ""
    medicalConditions: str = ""
    allergies: str = ""
    familySize: int = 1