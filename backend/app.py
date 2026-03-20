from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "TeaZen Flask backend is running!"

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    return jsonify({
        "reply": "Test reply from Flask: " + user_message
    })

if __name__ == "__main__":
    app.run(debug=True)