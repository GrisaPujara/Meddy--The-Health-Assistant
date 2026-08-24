import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# ==========================
# API KEYS
# ==========================

# Google Gemini API Key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# OpenAI API Key (for future use)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ==========================
# DATABASE PATH
# ==========================

DB_FAISS_PATH = "vectorstore/db_faiss"

# ==========================
# LLM CONFIGURATION
# ==========================

MODEL_NAME = "gemini-2.5-flash"

# ==========================
# RETRIEVAL SETTINGS
# ==========================

TOP_K = 5