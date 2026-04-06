from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import json
import os
import re
## testing

import logging
from datetime import datetime

app= Flask(__name__)

CORS(app)

#MySQL connection
db_password = "Poiu2115"

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://root:{db_password}@localhost/boba_shop_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

db = SQLAlchemy(app)

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
 
# Models and job endpoints

class JobPosition(db.Model):
    __tablename__ = "jobpositions"

    positionID = db.Column(db.Integer, primary_key=True)
    positionTitle = db.Column(db.String(120), nullable=False)

    def to_dict(self):
        return {
            "positionID": self.positionID,
            "positionTitle": self.positionTitle
        }


class JobApplication(db.Model):
    __tablename__ = "jobapplications"

    applicationID = db.Column(db.Integer, primary_key=True)
    positionID = db.Column(
        db.Integer,
        db.ForeignKey("jobpositions.positionID"),
        nullable=False
    )
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    experience = db.Column(db.String(300), nullable=False)

    def to_dict(self):
        return {
            "applicationID": self.applicationID,
            "positionID": self.positionID,
            "name": self.name,
            "email": self.email,
            "experience": self.experience
        }
    

class Order(db.Model):
    __tablename__ = "orders"

    orderID = db.Column(db.Integer, primary_key=True)
    customerID = db.Column(db.Integer, nullable=False)
    orderDate = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(30), nullable=False)
    paymentMethod = db.Column(db.String(50), nullable=False)
    totalAmount = db.Column(db.Numeric(8, 2), nullable=False)

    def to_dict(self):
        return {
            "orderID": self.orderID,
            "customerID": self.customerID,
            "orderDate": self.orderDate.isoformat() if self.orderDate else None,
            "status": self.status,
            "paymentMethod": self.paymentMethod,
            "totalAmount": float(self.totalAmount)
        }
    

class OrderDetail(db.Model):
    __tablename__ = "orderdetails"

    orderDetailID = db.Column(db.Integer, primary_key=True)
    orderID = db.Column(db.Integer, db.ForeignKey("orders.orderID"), nullable=False)
    menuItemID = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    item_price = db.Column(db.Numeric(8, 2), nullable=False)
    specialRequest = db.Column(db.String(255), nullable=True)


    def to_dict(self):
        return {
            "orderDetailID": self.orderDetailID,
            "orderID": self.orderID,
            "menuItemID": self.menuItemID,
            "quantity": self.quantity,
            "item_price": float(self.item_price),
            "specialRequest": self.specialRequest
        }

def seed_positions():
    try:
        if JobPosition.query.count() == 0:
            defaults = [
                JobPosition(positionTitle="Barista"),
                JobPosition(positionTitle="Cashier"),
                JobPosition(positionTitle="Shift Supervisor"),
            ]
            db.session.add_all(defaults)
            db.session.commit()
    except Exception:
        pass


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


@app.route("/job-positions", methods=["GET"])
def get_job_positions():
    positions = JobPosition.query.all()
    return jsonify([p.to_dict() for p in positions])


@app.route("/applications", methods=["GET"])
def list_applications():
    apps = JobApplication.query.order_by(JobApplication.applicationID.desc()).all()
    return jsonify([a.to_dict() for a in apps])


@app.route("/submit-job", methods=["POST"])
def submit_job():
    data = request.get_json() or {}
    logger.info("Received submit-job data: %s", data)

    try:
        positionID = int(data.get("positionID"))
    except Exception:
        return jsonify({"success": False, "error": "Invalid positionID"}), 400

    name = data.get("name")
    email = data.get("email")
    experience = data.get("experience")

    if not (positionID and name and email and experience):
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    position = JobPosition.query.get(positionID)
    if not position:
        return jsonify({"success": False, "error": "Invalid position"}), 400

    app_entry = JobApplication(positionID=positionID, name=name, email=email, experience=experience)
    db.session.add(app_entry)
    try:
        db.session.commit()
    except Exception as e:
        logger.exception("DB commit failed for job application")
        db.session.rollback()
        return jsonify({"success": False, "error": "Database error"}), 500

    logger.info("Inserted application id=%s", app_entry.applicationID)
    return jsonify({"success": True, "message": "Application submitted", "id": app_entry.applicationID})

@app.route("/submit-order", methods=["POST"])
def submit_order():
    data = request.get_json() or {}
    logger.info("Received submit-order data: %s", data)

    customerID = data.get("customerID")
    paymentMethod = data.get("paymentMethod")
    totalAmount = data.get("totalAmount")
    items = data.get("items", [])

    if not customerID or not paymentMethod or totalAmount is None or not items:
        return jsonify({"success": False, "error": "Missing required order fields"}), 400

    try:
        new_order = Order(
            customerID=int(customerID),
            status="Pending",
            paymentMethod=paymentMethod,
            totalAmount=float(totalAmount)
        )
        db.session.add(new_order)
        db.session.flush()

        for item in items:
            detail = OrderDetail(
                orderID=new_order.orderID,
                menuItemID=int(item["menuItemID"]),
                quantity=int(item["quantity"]),
                item_price=float(item["item_price"]),
                specialRequest=item.get("specialRequest", "")
            )
            db.session.add(detail)

        db.session.commit()

        logger.info("Inserted order id=%s", new_order.orderID)
        return jsonify({
            "success": True,
            "message": "Order submitted successfully",
            "orderID": new_order.orderID
        })

    except Exception:
        logger.exception("DB commit failed for order")
        db.session.rollback()
        return jsonify({"success": False, "error": "Database error"}), 500

if __name__ == "__main__":
    with app.app_context():
            db.create_all()
            #seed_positions()
    app.run(debug=True)

