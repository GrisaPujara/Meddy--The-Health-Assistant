from fastapi import APIRouter, HTTPException

from backend.schemas.models import (
    ChatRequest,
    ChatResponse,
    FamilyCreateRequest,
    FamilyJoinRequest,
    FamilyPersonRequest,
    GroceryPlanRequest,
    NutritionPlanRequest,
    ReminderCreateRequest,
    ReminderUpdateRequest,
)
from backend.services.retriever import Retriever
from backend.services.llm import LLMService
from backend.services import family_store

router = APIRouter()

# Load once when the server starts
retriever = Retriever()
llm_service = LLMService()


@router.post("/grocery/plan")
def grocery_plan(request: GroceryPlanRequest):
    members = [m.model_dump() for m in request.members if m.included]

    if not members:
        raise HTTPException(
            status_code=400,
            detail="Include at least one family member.",
        )

    if request.budget <= 0:
        raise HTTPException(status_code=400, detail="Budget must be greater than 0.")

    try:
        plan = llm_service.generate_grocery_plan(request.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return plan


@router.post("/nutrition/plan")
def nutrition_plan(request: NutritionPlanRequest):
    if request.budget <= 0:
        raise HTTPException(status_code=400, detail="Budget must be greater than 0.")

    try:
        plan = llm_service.generate_nutrition_plan(request.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return plan


@router.get("/family")
def get_family(email: str):
    family = family_store.get_family(email)
    if not family:
        return {"family": None}
    return {"family": family}


@router.post("/family")
def create_family(request: FamilyCreateRequest):
    try:
        family = family_store.create_family(
            request.email,
            request.displayName,
            request.familyName,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"family": family}


@router.post("/family/join")
def join_family(request: FamilyJoinRequest):
    try:
        family = family_store.join_family(
            request.email,
            request.displayName,
            request.inviteCode,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"family": family}


@router.post("/family/leave")
def leave_family(request: FamilyCreateRequest):
    family_store.leave_family(request.email)
    return {"family": None}


@router.post("/family/people")
def add_family_person(request: FamilyPersonRequest):
    try:
        family = family_store.add_person(request.email, request.name, request.role)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"family": family}


@router.post("/family/reminders")
def create_reminder(request: ReminderCreateRequest):
    if request.type not in {"medicine", "checkup", "yearly"}:
        raise HTTPException(status_code=400, detail="Reminder type must be medicine, checkup, or yearly.")
    try:
        family = family_store.add_reminder(request.email, request.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"family": family}


@router.patch("/family/reminders/{reminder_id}")
def patch_reminder(reminder_id: str, request: ReminderUpdateRequest):
    try:
        family = family_store.update_reminder(
            request.email,
            reminder_id,
            request.model_dump(exclude={"email"}),
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"family": family}


@router.delete("/family/reminders/{reminder_id}")
def remove_reminder(reminder_id: str, email: str):
    try:
        family = family_store.delete_reminder(email, reminder_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"family": family}


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    # Search the medical knowledge base
    docs = retriever.search(request.question)

    # Combine retrieved documents into one context
    context = "\n\n".join([doc.page_content for doc in docs])

    # Get answer from Gemini
    answer = llm_service.answer(
        request.question,
        context
    )

    # Extract page numbers
    sources = []

    for doc in docs:
        page = doc.metadata.get("page")

        if page is not None:
            sources.append(page)

    return ChatResponse(
        answer=answer if isinstance(answer, str) else str(answer),
        sources=sources
    )