from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import re

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

def tokenize(text):
    text = text.lower()
    words = re.findall(r"\b\w+\b", text)
    stop_words = {
        "what", "is", "the", "a", "an", "do", "does", "in", "on", "of",
        "to", "i", "me", "my", "you", "your", "it", "and", "or", "at",
        "for", "are", "with", "can", "how", "much", "any"
    }
    return [word for word in words if word not in stop_words]

@app.route("/")
def home():
    return "TeaZen Flask backend is running!"

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"reply": "Please type a question."})

    training_data = load_training_data()

    if isinstance(training_data, dict) and "error" in training_data:
        return jsonify({"reply": training_data["error"]})

    user_tokens = set(tokenize(user_message))

    best_reply = None
    best_score = 0

    for example in training_data:
        messages = example.get("messages", [])
        example_user = ""
        example_assistant = ""

        for message in messages:
            if message.get("role") == "user":
                example_user = message.get("content", "")
            elif message.get("role") == "assistant" and not example_assistant:
                example_assistant = message.get("content", "")

        example_tokens = set(tokenize(example_user))
        score = len(user_tokens.intersection(example_tokens))

        if score > best_score and example_assistant:
            best_score = score
            best_reply = example_assistant

    if best_score >= 2:
        return jsonify({
    "reply": f"{best_reply}\n\n(TeaZen Assistant 🤖)"
})

    return jsonify({
    "reply": "I'm not 100% sure, but we offer a variety of boba drinks, snacks, and events. Try asking about our menu, drinks, or jobs!"
})

if __name__ == "__main__":
    app.run(debug=True)