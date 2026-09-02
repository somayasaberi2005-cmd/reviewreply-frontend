import pandas as pd
import chromadb
from chromadb.utils import embedding_functions

client = chromadb.PersistentClient(path="vector_db")

embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

topics = ["bank_card", "registration", "dormitory", "holidays", "exams", "university_system", "visa", "campus_navigation", "onay_card", "greeting"]

for topic in topics:
    path = f"data/categorized/{topic}.csv"
    df = pd.read_csv(path)
    print(f"DEBUG {topic}: path={path}, rows={len(df)}, columns={list(df.columns)}")

    if len(df) == 0:
        print(f"{topic}: skipped (empty)")
        continue

    try:
        client.delete_collection(name=topic)
    except Exception:
        pass

    collection = client.get_or_create_collection(
        name=topic,
        embedding_function=embedding_function
    )

    documents = df["instruction"].tolist()
    metadatas = [{"response": r} for r in df["response"]]
    ids = [f"{topic}_{i}" for i in range(len(df))]

    batch_size = 1000
    for i in range(0, len(documents), batch_size):
        collection.add(
            documents=documents[i:i + batch_size],
            metadatas=metadatas[i:i + batch_size],
            ids=ids[i:i + batch_size]
        )

    print(f"{topic}: added {len(df)} entries to vector store")

print("\nDone building vector store.")
