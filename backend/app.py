from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3"

MENU_CONTEXT = """
You are TeaZen Assistant for TeaZen Boba Bar.

TeaZen drink menu:
- Classic Milk Tea:
  Traditional black tea with creamy milk and chewy tapioca pearls.
  Prices: Regular $5.50, Large $6.50

- Taro Bliss:
  Sweet taro root blended with milk and choice of toppings.
  Prices: Regular $6.00, Large $7.00

- Matcha Zen:
  Premium Japanese matcha whisked with oat milk and honey boba.
  Prices: Regular $6.75, Large $7.75

- Strawberry Cloud:
  Fresh strawberries blended with jasmine tea, topped with sweet cheese foam.
  Prices: Regular $6.50, Large $7.50

- Brown Sugar Tiger:
  House-made brown sugar syrup swirled with fresh milk and chewy pearls.
  Prices: Regular $6.25, Large $7.25

TeaZen snacks:
- Mochi Trio:
  Three pieces of handmade mochi in rotating seasonal flavors.
  Price: $5.00

- Taiyaki:
  Fish-shaped waffle pastry filled with red bean, Nutella, or custard.
  Price range: $3.50 to $9.00
  Options: 1 piece or 3 pieces

- Poké Bowl:
  Fresh tuna or tofu over seasoned rice with avocado, edamame, and sesame.
  Price: $12.95

- Summer Rolls:
  Two rice paper rolls with shrimp or tofu, fresh herbs, and rice noodles.
  Price: $7.50

TeaZen merch:
- TeaZen Zen Vibes Tee:
  100% organic cotton, sizes S to XL.
  Wear in-store for 10% off your drink.
  Price: $18.95

- TeaZen Boba Tumbler:
  20oz tumbler with wide boba straw.
  Keeps drinks cold for hours.
  Bring in for 10% off.
  Price: $14.95

Rules:
- Only answer questions about TeaZen menu items, ingredients, flavors, sweetness, texture, caffeine, snacks, merch, events, and light menu guidance.
- Do not place orders.
- Do not track orders.
- Do not process payments.
- If the user asks to place an order, track an order, or pay, tell them to use the website's Order or Track Order section.
- Do not invent menu items that are not listed here.
- If you do not know something exactly, say so clearly.
- Keep replies friendly, short, and clear.
"""

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
{MENU_CONTEXT}

Customer question:
{user_message}

Assistant reply:
"""

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
        data = response.json()
        reply = data.get("response", "").strip()

        print("Ollama reply:", reply)

        if not reply:
            reply = "Sorry, I couldn't answer that right now."

        return jsonify({"reply": reply})

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to Ollama.")
        return jsonify({
            "reply": (
                "Hi! Welcome to TeaZen Boba Bar 🍵\n\n"
                "Here's what's on our menu:\n"
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
                "Of course! Here's what we currently offer at TeaZen 🍹\n\n"
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

    min_score = 1 if len(user_tokens) <= 2 else 2
    if best_score >= min_score:
        return jsonify({
            "reply": f"{best_reply}\n\nTeaZen Assistant"
        })

    return jsonify({
        "reply": (
            "I'm still learning 🤖\n\n"
            "Try asking about:\n"
            "• Drinks\n"
            "• Toppings\n"
            "• Caffeine\n"
            "• Events\n"
            "• Jobs\n\n"
            "TeaZen Assistant"
        )
    })

@app.route("/api/apply", methods=["POST"])
def submit_application():
    """
    Handle job application submissions.
    Data from the form is received here and can be stored in MySQL.
    """
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["name", "email", "phone", "position", "startDate", "experience", "availability"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Basic email validation
        if "@" not in data.get("email", ""):
            return jsonify({"error": "Invalid email format"}), 400

        # TODO: Database person - Insert this data into MySQL table
        # Example structure:
        # INSERT INTO job_applications (name, email, phone, position, start_date, experience, availability, submitted_at)
        # VALUES (data['name'], data['email'], data['phone'], data['position'], data['startDate'], data['experience'], data['availability'], NOW())

        print(f"New job application: {data}")  # Debug log

        return jsonify({
            "success": True,
            "message": "Application received successfully!"
        }), 200

    except Exception as e:
        print(f"Error processing application: {str(e)}")
        return jsonify({"error": "Failed to process application"}), 500

if __name__ == "__main__":
    app.run(debug=True)
