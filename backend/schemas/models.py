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


class FamilyCreateRequest(BaseModel):
    email: str
    displayName: str = ""
    familyName: str = ""


class FamilyJoinRequest(BaseModel):
    email: str
    displayName: str = ""
    inviteCode: str


class FamilyPersonRequest(BaseModel):
    email: str
    name: str
    role: str = "Family"


class ReminderCreateRequest(BaseModel):
    email: str
    type: str
    title: str
    notes: str = ""
    personId: str
    time: str
    date: str = ""
    repeat: str = "once"


class ReminderUpdateRequest(BaseModel):
    email: str
    enabled: Optional[bool] = None
    title: Optional[str] = None
    time: Optional[str] = None