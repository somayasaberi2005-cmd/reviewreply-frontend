import re
import chromadb
from chromadb.utils import embedding_functions

client = chromadb.PersistentClient(path="vector_db")
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

TOPIC_KEYWORDS = {
    "onay_card": ["onay"],
    "visa": ["visa", "passport translation", "immigration", "residence permit", "embassy", "kremet"],
    "bank_card": ["bank account", "bank card", "spravka", "iin", "open an account", "bank"],
    "registration": ["register", "registration", "enroll", "course selection", "add course", "drop course"],
    "dormitory": ["dormitory", "dorm", "hostel", "roommate", "housing"],
    "holidays": ["holiday", "vacation", "break", "semester break", "public holiday"],
    "exams": ["exam", "online exam", "test", "quiz", "grades", "results"],
    "university_system": ["university", "department", "portal", "student id", "semester", "gpa"],
    "campus_navigation": ["building", "how to get to", "location", "floor", "map"],
    "greeting": ["hi", "hello", "hey", "how are you", "who are you", "what can you do", "good morning", "good evening", "thanks", "thank you"]
}


def detect_topic(user_question: str) -> str:
    question_lower = user_question.lower()
    for topic, keywords in TOPIC_KEYWORDS.items():
        for keyword in keywords:
            pattern = r"\b" + re.escape(keyword) + r"\b"
            if re.search(pattern, question_lower):
                return topic
    return "unknown"


def answer_question(user_question: str) -> dict:
    topic = detect_topic(user_question)

    if topic == "unknown":
        return {"topic": topic, "answer": "Sorry, I don't have information on that topic yet."}

    try:
        collection = client.get_collection(name=topic, embedding_function=embedding_function)
    except Exception:
        return {"topic": topic, "answer": f"No data available yet for topic '{topic}'."}

    if collection.count() == 0:
        return {"topic": topic, "answer": f"No data available yet for topic '{topic}'."}

    results = collection.query(query_texts=[user_question], n_results=1)
    return {"topic": topic, "answer": results["metadatas"][0][0]["response"]}
