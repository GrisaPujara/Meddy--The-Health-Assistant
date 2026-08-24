from dotenv import load_dotenv
import os

load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# ---------------------------------------------------
# API KEY
# ---------------------------------------------------

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env")

DB_FAISS_PATH = "vectorstore/db_faiss"

# ---------------------------------------------------
# PROMPT
# ---------------------------------------------------

CUSTOM_PROMPT_TEMPLATE = """
You are Meddy, an AI medical assistant.

Answer ONLY using the retrieved medical context.

If the retrieved context contains related information,
combine it into one clear medical explanation.

Do NOT invent diseases, treatments or medical facts.

If the retrieved context truly does not contain the answer,
say:

"I Have Similar Information For That."

Always explain in simple language.

Context:
{context}

Question:
{question}

Helpful Answer:
"""

# ---------------------------------------------------
# LLM
# ---------------------------------------------------

def load_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=GOOGLE_API_KEY,
        temperature=0.2
    )

# ---------------------------------------------------
# Prompt
# ---------------------------------------------------

def set_custom_prompt():
    return PromptTemplate(
        template=CUSTOM_PROMPT_TEMPLATE,
        input_variables=["context", "question"]
    )

# ---------------------------------------------------
# Embeddings
# ---------------------------------------------------

print("Loading embedding model...")

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

print("Embedding model loaded.")

# ---------------------------------------------------
# FAISS
# ---------------------------------------------------

print("Loading FAISS database...")

db = FAISS.load_local(
    DB_FAISS_PATH,
    embedding_model,
    allow_dangerous_deserialization=True
)

print("FAISS loaded.")

# ---------------------------------------------------
# Retriever
# ---------------------------------------------------

retriever = db.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 8,
        "fetch_k": 20
    }
)

# ---------------------------------------------------
# Gemini
# ---------------------------------------------------

print("Loading Gemini...")

llm = load_llm()

print("Gemini loaded.")

# ---------------------------------------------------
# QA Chain
# ---------------------------------------------------

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
    chain_type_kwargs={
        "prompt": set_custom_prompt()
    }
)

print("\n===================================")
print("        MEDDY IS READY")
print("===================================")

# ---------------------------------------------------
# CHAT
# ---------------------------------------------------

while True:

    query = input("\nAsk Meddy: ")

    if query.lower() in ["exit", "quit"]:
        print("Goodbye!")
        break

    print("\nSearching medical documents...")

    result = qa_chain.invoke({"query": query})

    print("\n===================================\n")
    print("ANSWER")
    print("\n===================================\n")

    print(result["result"])

    print("\n===================================")
    print("SOURCES")
    print("===================================")

    for i, doc in enumerate(result["source_documents"], 1):

        page = doc.metadata.get("page", "Unknown")

        print(f"\nDocument {i} | Page {page}")
        print("-" * 50)
        print(doc.page_content[:400])