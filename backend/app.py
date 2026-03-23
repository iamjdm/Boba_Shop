from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

def load_training_data():
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "teazen_training_chatml.jsonl"),
        os.path.join(os.path.dirname(__file__), "..", "teazen_training_chatml.jsonl")
    ]

    data = []
    file_found = None

    for path in possible_paths:
        if os.path.exists(path):
            file_found = path
            break

    if not file_found:
        return {"error": "Training file not found"}

    with open(file_found, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                data.append(json.loads(line))

    return data

@app.route("/")
def home():
    return "TeaZen Flask backend is running!"

STOPWORDS = {"a", "an", "the", "is", "are", "do", "does", "can", "i", "you",
             "what", "how", "tell", "me", "about", "any", "in", "on", "at",
             "to", "of", "and", "or", "for", "with", "it", "my", "your"}

def keywords(text):
    words = text.lower().split()
    return {w.strip("?.,!") for w in words if w.strip("?.,!") not in STOPWORDS and len(w) > 2}

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    training_data = load_training_data()

    if isinstance(training_data, dict) and "error" in training_data:
        return jsonify({"reply": training_data["error"]})

    user_keys = keywords(user_message)
    best_reply = None
    best_score = 0

    for example in training_data:
        messages = example.get("messages", [])
        user_parts = [m["content"] for m in messages if m["role"] == "user"]
        assistant_parts = [m["content"] for m in messages if m["role"] == "assistant"]

        for user_part in user_parts:
            score = len(user_keys & keywords(user_part))
            if score > best_score:
                best_score = score
                best_reply = assistant_parts[0] if assistant_parts else None

    if best_score >= 1 and best_reply:
        return jsonify({"reply": best_reply})

    return jsonify({"reply": "Sorry, I'm still learning. Can you rephrase that?"})

if __name__ == "__main__":
    app.run(debug=True)