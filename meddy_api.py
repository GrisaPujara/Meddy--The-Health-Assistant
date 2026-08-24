from dotenv import load_dotenv
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env file")


# =========================================================
# CONFIGURATION
# =========================================================

DB_FAISS_PATH = "vectorstore/db_faiss"


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI(
    title="Meddy AI Medical Assistant",
    description="RAG-based Medical Assistant using FAISS and Gemini",
    version="1.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class ChatRequest(BaseModel):
    question: str


# =========================================================
# MEDDY PROMPT
# =========================================================

CUSTOM_PROMPT_TEMPLATE = """
You are Meddy, an AI medical and health assistant.

Your knowledge for this response comes ONLY from the
medical context retrieved from the provided medical documents.

IMPORTANT RULES:

1. Answer medical and health-related questions using ONLY
   the retrieved context.

2. Do not invent diseases, symptoms, treatments,
   medications, diagnoses, medical facts, or statistics.

3. If the user asks something completely unrelated to
   medicine or healthcare, do NOT try to answer it using
   the medical context.

   For unrelated questions, respond:

   "I'm Meddy, a medical health assistant. I can help with
   health and medical questions, but I don't have information
   about that topic."

4. If the question is medical or health-related but the
   retrieved context does not contain enough information,
   respond:

   "I don't have enough information about that in my
   medical documents."

5. Explain medical information in simple language.

6. Do not give a personal diagnosis.

7. Do not prescribe medicines or provide personalized
   prescriptions.

8. For serious medical symptoms, encourage the user to
   consult a qualified healthcare professional.

9. Do not mention the retrieval system, FAISS, embeddings,
   or internal technical details to the user.

Context:
{context}

Question:
{question}

Helpful Answer:
"""


# =========================================================
# GEMINI
# =========================================================

def load_llm():

    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=GOOGLE_API_KEY,
        temperature=0.2
    )


# =========================================================
# PROMPT
# =========================================================

prompt = PromptTemplate(
    template=CUSTOM_PROMPT_TEMPLATE,
    input_variables=["context", "question"]
)


# =========================================================
# LOAD EMBEDDING MODEL
# =========================================================

print("Loading Embeddings...")

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

print("Embeddings Loaded.")


# =========================================================
# LOAD FAISS DATABASE
# =========================================================

print("Loading FAISS...")

db = FAISS.load_local(
    DB_FAISS_PATH,
    embedding_model,
    allow_dangerous_deserialization=True
)

print("FAISS Loaded.")


# =========================================================
# RETRIEVER
# =========================================================

retriever = db.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 8,
        "fetch_k": 20
    }
)


# =========================================================
# LOAD GEMINI
# =========================================================

print("Loading Gemini...")

llm = load_llm()

print("Gemini Loaded.")


# =========================================================
# RAG CHAIN
# =========================================================

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
    chain_type_kwargs={
        "prompt": prompt
    }
)


print("")
print("======================================")
print("       MEDDY BACKEND IS READY")
print("======================================")
print("")


# =========================================================
# HOME API
# =========================================================

@app.get("/")
def home():

    return {
        "status": "Backend Running",
        "assistant": "Meddy",
        "model": "Gemini 2.5 Flash",
        "database": "FAISS"
    }


# =========================================================
# CHAT API
# =========================================================

@app.post("/chat")
def chat(request: ChatRequest):

    question = request.question.strip()

    # ---------------------------------------------
    # Empty question protection
    # ---------------------------------------------

    if not question:

        return {
            "answer": "Please enter a health-related question."
        }


    print("")
    print("======================================")
    print("USER QUESTION")
    print("======================================")
    print(question)


    # ---------------------------------------------
    # Run RAG
    # ---------------------------------------------

    result = qa_chain.invoke(
        {
            "query": question
        }
    )


    answer = result["result"]


    print("")
    print("MEDDY ANSWER")
    print("======================================")
    print(answer)


    # ---------------------------------------------
    # Return response to React
    # ---------------------------------------------

    return {
        "answer": answer
    }