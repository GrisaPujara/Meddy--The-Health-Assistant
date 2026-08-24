from fastapi import APIRouter, HTTPException

from backend.schemas.models import (
    ChatRequest,
    ChatResponse,
    GroceryPlanRequest,
    NutritionPlanRequest,
)
from backend.services.retriever import Retriever
from backend.services.llm import LLMService

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
        answer=answer,
        sources=sources
    )