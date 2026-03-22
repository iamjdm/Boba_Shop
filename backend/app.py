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
        "for", "are", "with", "can", "how", "much", "any", "we", "have"
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

    lower_message = user_message.lower()

    # Friendly greeting responses
    if lower_message in ["hi", "hello", "hey", "hey there", "hi there"]:
        return jsonify({
            "reply": (
                "Hi! Welcome to TeaZen Boba Bar 🍵\n\n"
                "Here’s what’s on our menu:\n"
                "• Signature Boba Teas\n"
                "• Premium Milk Teas\n"
                "• Mochi, Taiyaki & Asian Pastries\n"
                "• Fresh Poké Bowls & Summer Rolls\n\n"
                "You can also ask me about ingredients, caffeine, toppings, events, or jobs.\n\n"
                "TeaZen Assistant"
            )
        })

    if "menu" in lower_message:
        return jsonify({
            "reply": (
                "Of course! Here’s what we currently offer at TeaZen 🍹\n\n"
                "• Signature Boba Teas\n"
                "• Premium Milk Teas\n"
                "• Mochi, Taiyaki & Asian Pastries\n"
                "• Fresh Poké Bowls & Summer Rolls\n\n"
                "If you want, you can ask me about a specific drink, toppings, or caffeine content.\n\n"
                "TeaZen Assistant"
            )
        })

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
            if message.get("role") == "user" and not example_user:
                example_user = message.get("content", "")
            elif message.get("role") == "assistant" and not example_assistant:
                example_assistant = message.get("content", "")

        example_tokens = set(tokenize(example_user))
        score = len(user_tokens.intersection(example_tokens))

        if user_message.lower() == example_user.lower():
            score += 100

        if score > best_score and example_assistant:
            best_score = score
            best_reply = example_assistant

    if best_score >= 2:
        return jsonify({
            "reply": f"{best_reply}\n\nTeaZen Assistant"
        })

    return jsonify({
        "reply": (
            "I’m still learning 🤖\n\n"
            "Try asking about:\n"
            "• Drinks\n"
            "• Toppings\n"
            "• Caffeine\n"
            "• Events\n"
            "• Jobs\n\n"
            "TeaZen Assistant"
        )
    })

if __name__ == "__main__":
    app.run(debug=True)