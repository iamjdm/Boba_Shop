from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

OLLAMA_URL = os.getenv("OLLAMA_URL")
MODEL_NAME = os.getenv("OLLAMA_MODEL")

with open("menu_data.json", "r", encoding="utf-8") as f:
    menu_data = json.load(f)

with open("prompt.txt", "r", encoding="utf-8") as f:
    system_prompt = f.read().strip()


@app.route("/")
def home():
    return "TeaZen Flask backend is running with Ollama"


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").strip()

    print("User asked:", user_message)

    if not user_message:
        return jsonify({"reply": "Please type a question."}), 400

    prompt = f"""
{system_prompt}

TeaZen menu data:
{json.dumps(menu_data, indent=2)}

Customer question:
{user_message}

Assistant reply:
""".strip()

    try:
        print("Sending request to Ollama...")

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()
        result = response.json()
        reply = result.get("response", "").strip()

        print("Ollama reply:", reply)

        if not reply:
            reply = "Sorry, I couldn't answer that right now."

        return jsonify({"reply": reply})

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to Ollama.")
        return jsonify({
            "reply": "Error: Could not connect to Ollama. Make sure Ollama is installed and running."
        }), 503

    except requests.exceptions.Timeout:
        print("Error: Ollama timed out.")
        return jsonify({
            "reply": "Error: Ollama took too long to respond."
        }), 504

    except Exception as e:
        print("Unexpected error:", str(e))
        return jsonify({
            "reply": "Error connecting to local AI model."
        }), 500


@app.route("/api/order-ai", methods=["POST"])
def order_ai():
    try:
        data = request.get_json(silent=True) or {}

        prompt = f"""
{system_prompt}

A customer cart payload was sent from the TeaZen order page.
Summarize the cart clearly and politely.

Order payload:
{json.dumps(data, indent=2)}

Rules:
- Do not process payment
- Do not claim the order was actually submitted
- Do not say the order is complete
- Just explain what is in the cart
- Keep it short and neat
""".strip()

        print("Sending order payload to Ollama...")

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()
        result = response.json()
        reply = result.get("response", "").strip()

        print("Ollama order reply:", reply)

        if not reply:
            reply = "The order payload was received successfully."

        return jsonify({"reply": reply}), 200

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to Ollama for order payload.")
        return jsonify({
            "reply": "Error: Could not connect to Ollama. Make sure Ollama is installed and running."
        }), 503

    except requests.exceptions.Timeout:
        print("Error: Ollama timed out for order payload.")
        return jsonify({
            "reply": "Error: Ollama took too long to respond."
        }), 504

    except Exception as e:
        print("Error in /api/order-ai:", str(e))
        return jsonify({
            "reply": "Failed to process AI order payload."
        }), 500


@app.route("/api/apply", methods=["POST"])
def submit_application():
    try:
        data = request.get_json()

        required_fields = [
            "name",
            "email",
            "phone",
            "position",
            "startDate",
            "experience",
            "availability"
        ]

        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400

        if "@" not in data.get("email", ""):
            return jsonify({"error": "Invalid email format"}), 400

        print(f"New job application: {data}")

        return jsonify({
            "success": True,
            "message": "Application received successfully!"
        }), 200

    except Exception as e:
        print(f"Error processing application: {str(e)}")
        return jsonify({"error": "Failed to process application"}), 500


if __name__ == "__main__":
    app.run(debug=True)