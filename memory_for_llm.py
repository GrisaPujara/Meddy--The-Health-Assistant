import os
from dotenv import load_dotenv

from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


load_dotenv()


PDF_PATH = os.path.join("data", "Harrison.pdf")

if not os.path.exists(PDF_PATH):
    raise FileNotFoundError(
        f"\n❌ PDF not found!\n\nExpected location:\n{os.path.abspath(PDF_PATH)}"
    )

print(f"✅ PDF Found: {os.path.abspath(PDF_PATH)}")


print("\n📖 Loading PDF...")

loader = PyMuPDFLoader(PDF_PATH)
documents = loader.load()

print(f"✅ Total Pages Loaded: {len(documents)}")


print("\n✂ Creating text chunks...")

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=150,
)

text_chunks = text_splitter.split_documents(documents)

print(f"✅ Total Chunks: {len(text_chunks)}")


print("\n🤖 Loading embedding model...")

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

print("✅ Embedding model loaded!")

# --------------------------------------------------
# CREATE VECTORSTORE
# --------------------------------------------------
DB_FAISS_PATH = "vectorstore/db_faiss"

print("\n🧠 Creating FAISS vector database...")

db = FAISS.from_documents(text_chunks, embedding_model)

print("✅ FAISS database created!")

# --------------------------------------------------
# SAVE DATABASE
# --------------------------------------------------
os.makedirs("vectorstore", exist_ok=True)

print("\n💾 Saving database...")

db.save_local(DB_FAISS_PATH)

print("✅ Database saved successfully!")

print("\n🎉 Memory creation completed successfully!")