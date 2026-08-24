from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from backend.config import DB_FAISS_PATH


class Retriever:

    def __init__(self):
        self.embedding_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        self.db = FAISS.load_local(
            DB_FAISS_PATH,
            self.embedding_model,
            allow_dangerous_deserialization=True,
        )

    def search(self, question, k=5):
        docs = self.db.similarity_search(question, k=k)
        return docs