from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from sqlalchemy.exc import IntegrityError
from groq import Groq
import json
import os
import re
import logging
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

app = Flask(__name__)

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY env var must be set to a random secret — never leave it blank")
app.config["SECRET_KEY"] = SECRET_KEY

ADMIN_KEY = os.getenv("ADMIN_KEY")

_cors_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
if not _cors_origins:
    raise RuntimeError("CORS_ORIGINS env var must be set to your frontend domain(s)")
CORS(app, origins=_cors_origins)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["300 per day", "60 per hour"],
    storage_uri="memory://"
)

# PostgreSQL connection
database_url = os.getenv("DATABASE_URL", "")
# Render historically provides postgres:// — SQLAlchemy requires postgresql://
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)
if not database_url:
    raise RuntimeError("DATABASE_URL env var must be set")
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = os.getenv("FLASK_DEBUG", "false").lower() == "true"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ALLOWED_PAGES = frozenset(["index", "menu", "events", "jobs", "order", "privacy"])

db = SQLAlchemy(app)

# Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL = "llama-3.3-70b-versatile"

# Email validation pattern
EMAIL_RE = re.compile(r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$')

_backend_dir = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(_backend_dir, "menu_data.json"), "r", encoding="utf-8") as f:
    menu_data = json.load(f)

with open(os.path.join(_backend_dir, "prompt.txt"), "r", encoding="utf-8") as f:
    system_prompt = f.read().strip()


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


def require_admin():
    if not ADMIN_KEY:
        return jsonify({"error": "Admin access not configured"}), 403
    provided = request.headers.get("X-Admin-Key", "")
    if provided != ADMIN_KEY:
        return jsonify({"error": "Unauthorized"}), 401
    return None


@app.after_request
def set_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# ===== DB MODELS =====

class JobPosition(db.Model):
    __tablename__ = "jobpositions"

    positionID = db.Column(db.Integer, primary_key=True)
    positionTitle = db.Column(db.String(99), nullable=False)
    description = db.Column(db.String(300), nullable=True)
    status = db.Column(db.String(45), nullable=False, default="Open")

    def to_dict(self):
        return {
            "positionID": self.positionID,
            "positionTitle": self.positionTitle,
            "description": self.description,
            "status": self.status
        }


class JobApplication(db.Model):
    __tablename__ = "jobapplications"

    applicationID = db.Column(db.Integer, primary_key=True)
    positionID = db.Column(db.Integer, db.ForeignKey("jobpositions.positionID"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    experience = db.Column(db.String(300), nullable=True)
    phone = db.Column(db.String(15), nullable=True)
    desired_start_date = db.Column(db.Date, nullable=True)
    availability = db.Column(db.Enum("full-time", "part-time", "flexible", name="availability_enum"), nullable=True)

    def to_dict(self):
        return {
            "applicationID": self.applicationID,
            "positionID": self.positionID,
            "name": self.name,
            "email": self.email,
            "experience": self.experience,
            "phone": self.phone,
            "desired_start_date": self.desired_start_date.isoformat() if self.desired_start_date else None,
            "availability": self.availability
        }


class Order(db.Model):
    __tablename__ = "orders"

    orderID = db.Column(db.Integer, primary_key=True)
    orderDate = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(30), nullable=False, default="pending")
    totalAmount = db.Column(db.Numeric(8, 2), nullable=False)

    def to_dict(self):
        return {
            "orderID": self.orderID,
            "orderDate": self.orderDate.isoformat() if self.orderDate else None,
            "status": self.status,
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


class MenuItem(db.Model):
    __tablename__ = "menuitem"

    menuItemID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(45), nullable=False)
    description = db.Column(db.String(250), nullable=True)
    price = db.Column(db.Numeric(8, 2), nullable=False)

    def to_dict(self):
        return {
            "menuItemID": self.menuItemID,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "price": float(self.price)
        }


class Event(db.Model):
    __tablename__ = "events"

    eventID = db.Column(db.Integer, primary_key=True)
    eventTitle = db.Column(db.String(100), nullable=False)
    eventDescription = db.Column(db.String(255), nullable=True)
    eventDate = db.Column(db.Date, nullable=False)
    startTime = db.Column(db.Time, nullable=True)
    endTime = db.Column(db.Time, nullable=True)
    location = db.Column(db.String(100), nullable=True)
    organizer = db.Column(db.String(100), nullable=True)
    eventStatus = db.Column(db.String(20), nullable=True)

    def to_dict(self):
        return {
            "eventID": self.eventID,
            "eventTitle": self.eventTitle,
            "eventDescription": self.eventDescription,
            "eventDate": self.eventDate.isoformat() if self.eventDate else None,
            "startTime": str(self.startTime) if self.startTime else None,
            "endTime": str(self.endTime) if self.endTime else None,
            "organizer": self.organizer,
            "location": self.location,
            "eventStatus": self.eventStatus,
        }


class EventAttendee(db.Model):
    __tablename__ = "event_attendees"
    __table_args__ = (db.UniqueConstraint("eventID", "email", name="uq_event_attendee"),)

    attendeeID = db.Column(db.Integer, primary_key=True)
    eventID = db.Column(db.Integer, db.ForeignKey("events.eventID"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    rsvpDate = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            "attendeeID": self.attendeeID,
            "eventID": self.eventID,
            "name": self.name,
            "email": self.email,
            "rsvpDate": self.rsvpDate.isoformat() if self.rsvpDate else None
        }


class EventRequest(db.Model):
    __tablename__ = "event_requests"

    requestID = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    requestedDate = db.Column(db.Date, nullable=True)
    requestedTime = db.Column(db.Time, nullable=True)
    category = db.Column(db.String(50), nullable=True)
    host = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(500), nullable=True)
    submittedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            "requestID": self.requestID,
            "title": self.title,
            "requestedDate": self.requestedDate.isoformat() if self.requestedDate else None,
            "requestedTime": str(self.requestedTime) if self.requestedTime else None,
            "category": self.category,
            "host": self.host,
            "description": self.description,
            "submittedAt": self.submittedAt.isoformat() if self.submittedAt else None,
        }


def seed_positions():
    try:
        if JobPosition.query.count() == 0:
            defaults = [
                JobPosition(positionTitle="Barista", description="Prepare and serve boba drinks, maintain cleanliness, and provide excellent customer service.", status="Open"),
                JobPosition(positionTitle="Cashier", description="Handle customer orders, process payments, and assist with front-of-house operations.", status="Open"),
                JobPosition(positionTitle="Shift Lead", description="Supervise staff, manage shifts, handle customer issues, and ensure smooth store operations.", status="Open"),
            ]
            db.session.add_all(defaults)
            db.session.commit()
    except Exception:
        pass


def seed_events():
    try:
        if Event.query.count() == 0:
            from datetime import date, time
            defaults = [
                Event(eventTitle="K-Pop Night", eventDescription="TeaZen hosts K-Pop Night for customers who want a fun music and hangout experience.", eventDate=date(2026, 7, 18), startTime=time(18, 0), endTime=time(21, 0), location="TeaZen Boba Bar", organizer="TeaZen Staff", eventStatus="Upcoming"),
                Event(eventTitle="Acoustic Night", eventDescription="A relaxed live music event for customers who want a calm TeaZen atmosphere.", eventDate=date(2026, 7, 25), startTime=time(17, 0), endTime=time(20, 0), location="TeaZen Boba Bar", organizer="TeaZen Staff", eventStatus="Upcoming"),
            ]
            db.session.add_all(defaults)
            db.session.commit()
    except Exception:
        pass


def seed_menu_items():
    try:
        if MenuItem.query.count() == 0:
            items = []
            for drink in menu_data.get("drinks", []):
                prices = drink.get("prices", {})
                desc = drink.get("description", "")
                items.append(MenuItem(name=drink["name"], category="Boba & Tea", description=desc, price=prices.get("regular", 5.50)))
                if "large" in prices:
                    items.append(MenuItem(name=f"{drink['name']} (Large)", category="Boba & Tea", description=desc, price=prices["large"]))
            for snack in menu_data.get("snacks", []):
                price = snack.get("price") or list(snack.get("price_options", {"1 pc": 3.50}).values())[0]
                items.append(MenuItem(name=snack["name"], category="Snack", description=snack.get("description", ""), price=price))
            for merch in menu_data.get("merch", []):
                items.append(MenuItem(name=merch["name"], category="Merch", description=merch.get("description", ""), price=merch.get("price", 0)))
            db.session.add_all(items)
            db.session.commit()
    except Exception:
        pass


# ===== ROUTES =====

# ===== FRONTEND SERVING =====

@app.route("/")
def serve_root():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<page>.html")
def serve_page(page):
    if page not in ALLOWED_PAGES:
        return jsonify({"error": "Not found"}), 404
    return send_from_directory(FRONTEND_DIR, f"{page}.html")

@app.route("/config.js")
def serve_config():
    return send_from_directory(FRONTEND_DIR, "config.js")

@app.route("/robots.txt")
def serve_robots():
    return send_from_directory(FRONTEND_DIR, "robots.txt")

@app.route("/favicon.ico")
def serve_favicon():
    return send_from_directory(os.path.join(FRONTEND_DIR, "images"), "favicon.ico")

@app.route("/styles/<path:filename>")
def serve_styles(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "styles"), filename)

@app.route("/scripts/<path:filename>")
def serve_scripts(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "scripts"), filename)

@app.route("/images/<path:filename>")
def serve_images(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "images"), filename)

@app.route("/audios/<path:filename>")
def serve_audios(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "audios"), filename)


@app.route("/api/chat", methods=["POST"])
@limiter.limit("15 per minute")
def chat():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"reply": "Please type a question."}), 400

    if len(user_message) > 500:
        return jsonify({"reply": "Message is too long. Please keep it under 500 characters."}), 400

    system_content = f"""{system_prompt}

TeaZen menu data:
{json.dumps(menu_data, indent=2)}"""

    try:
        logger.debug("Sending chat request to Groq")
        completion = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            max_tokens=512,
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": user_message}
            ]
        )
        reply = completion.choices[0].message.content.strip()
        if not reply:
            reply = "Sorry, I couldn't answer that right now."
        return jsonify({"reply": reply})

    except Exception:
        logger.exception("Groq API error in /api/chat")
        return jsonify({"reply": "Our assistant is unavailable right now. Please try again later."}), 503


@app.route("/api/order-ai", methods=["POST"])
@limiter.limit("15 per minute")
def order_ai():
    try:
        data = request.get_json(silent=True) or {}

        system_content = f"""{system_prompt}

Summarize the customer's cart payload clearly and politely.
Rules:
- Do not process payment
- Do not claim the order was actually submitted
- Do not say the order is complete
- Just explain what is in the cart
- Keep it short and neat"""

        logger.debug("Sending order payload to Groq")
        completion = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            max_tokens=512,
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": f"Order payload:\n{json.dumps(data, indent=2)}"}
            ]
        )
        reply = completion.choices[0].message.content.strip()
        if not reply:
            reply = "The order payload was received successfully."
        return jsonify({"reply": reply}), 200

    except Exception:
        logger.exception("Groq API error in /api/order-ai")
        return jsonify({"reply": "Our assistant is unavailable right now. Please try again later."}), 503


@app.route("/job-positions", methods=["GET"])
def get_job_positions():
    positions = JobPosition.query.all()
    return jsonify([p.to_dict() for p in positions])


@app.route("/applications", methods=["GET"])
def list_applications():
    err = require_admin()
    if err:
        return err
    apps = JobApplication.query.order_by(JobApplication.applicationID.desc()).all()
    return jsonify([a.to_dict() for a in apps])


@app.route("/submit-job", methods=["POST"])
@limiter.limit("10 per hour")
def submit_job():
    data = request.get_json() or {}
    logger.info("Received submit-job request")

    try:
        positionID = int(data.get("positionID"))
    except Exception:
        return jsonify({"success": False, "error": "Invalid positionID"}), 400

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    experience = (data.get("experience") or "").strip()
    phone = (data.get("phone") or "").strip()
    desired_start_date = data.get("startDate") or data.get("desired_start_date") or None
    availability = data.get("availability") or None

    if not (positionID and name and email):
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    if not EMAIL_RE.match(email):
        return jsonify({"success": False, "error": "Invalid email address"}), 400

    if len(name) > 100:
        return jsonify({"success": False, "error": "Name must be 100 characters or fewer"}), 400
    if len(email) > 150:
        return jsonify({"success": False, "error": "Email must be 150 characters or fewer"}), 400
    if len(experience) > 300:
        return jsonify({"success": False, "error": "Experience must be 300 characters or fewer"}), 400
    if len(phone) > 15:
        return jsonify({"success": False, "error": "Phone must be 15 characters or fewer"}), 400

    position = JobPosition.query.get(positionID)
    if not position:
        return jsonify({"success": False, "error": "Invalid position"}), 400

    app_entry = JobApplication(
        positionID=positionID,
        name=name,
        email=email,
        experience=experience or None,
        phone=phone or None,
        desired_start_date=desired_start_date,
        availability=availability
    )
    db.session.add(app_entry)
    try:
        db.session.commit()
    except Exception:
        logger.exception("DB commit failed for job application")
        db.session.rollback()
        return jsonify({"success": False, "error": "Database error"}), 500

    logger.info("Job application saved")
    return jsonify({"success": True, "message": "Application submitted successfully!"})


@app.route("/submit-order", methods=["POST"])
@limiter.limit("30 per hour")
def submit_order():
    data = request.get_json() or {}

    items = data.get("items", [])
    if not items:
        return jsonify({"success": False, "error": "Missing required order fields"}), 400

    if len(items) > 50:
        return jsonify({"success": False, "error": "Order contains too many items"}), 400

    try:
        computed_total = 0.0
        details = []
        for item in items:
            menu_item = MenuItem.query.get(int(item["menuItemID"]))
            if not menu_item:
                return jsonify({"success": False, "error": f"Invalid item in order"}), 400
            qty = int(item["quantity"])
            if qty < 1 or qty > 99:
                return jsonify({"success": False, "error": "Quantity must be between 1 and 99"}), 400
            price = float(menu_item.price)
            computed_total += price * qty
            special_req = (item.get("specialRequest") or "")[:255]
            details.append((int(item["menuItemID"]), qty, price, special_req))

        new_order = Order(status="Pending", totalAmount=round(computed_total, 2))
        db.session.add(new_order)
        db.session.flush()

        for menuItemID, qty, price, special_req in details:
            detail = OrderDetail(
                orderID=new_order.orderID,
                menuItemID=menuItemID,
                quantity=qty,
                item_price=price,
                specialRequest=special_req
            )
            db.session.add(detail)

        db.session.commit()
        logger.info("Order saved")
        return jsonify({
            "success": True,
            "message": "Order submitted successfully",
            "orderID": new_order.orderID
        })

    except Exception:
        logger.exception("DB commit failed for order")
        db.session.rollback()
        return jsonify({"success": False, "error": "Database error"}), 500


@app.route("/menu-items", methods=["GET"])
def get_menu_items():
    items = MenuItem.query.order_by(MenuItem.menuItemID.asc()).all()
    return jsonify([item.to_dict() for item in items])


@app.route("/events", methods=["GET"])
def get_events():
    events = Event.query.order_by(Event.eventDate.asc()).all()
    return jsonify([e.to_dict() for e in events])


@app.route("/api/rsvp", methods=["POST"])
@limiter.limit("20 per hour")
def rsvp():
    data = request.get_json() or {}
    event_id = data.get("eventID")
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()

    if not (event_id and name and email):
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    if not EMAIL_RE.match(email):
        return jsonify({"success": False, "error": "Invalid email address"}), 400

    if len(name) > 100:
        return jsonify({"success": False, "error": "Name must be 100 characters or fewer"}), 400

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"success": False, "error": "Event not found"}), 404

    existing = EventAttendee.query.filter_by(eventID=event_id, email=email).first()
    if existing:
        return jsonify({"success": False, "error": "This email is already registered for this event."}), 409

    attendee = EventAttendee(eventID=event_id, name=name, email=email)
    db.session.add(attendee)
    try:
        db.session.commit()
        logger.info("RSVP saved for event %s", event_id)
        return jsonify({
            "success": True,
            "message": f"You're registered for {event.eventTitle}! See you there."
        })
    except IntegrityError:
        db.session.rollback()
        return jsonify({"success": False, "error": "This email is already registered for this event."}), 409
    except Exception:
        logger.exception("DB commit failed for RSVP")
        db.session.rollback()
        return jsonify({"success": False, "error": "Database error"}), 500


@app.route("/submit-event", methods=["POST"])
def submit_event():
    err = require_admin()
    if err:
        return err
    data = request.get_json() or {}
    logger.info("Admin: submit-event")

    title = data.get("title")
    date = data.get("date")
    start_time = data.get("time")
    organizer = data.get("host")
    description = data.get("description")
    location = data.get("location")
    end_time = data.get("endTime")
    event_status = data.get("eventStatus", "Scheduled")

    if not (title and date):
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    try:
        event = Event(
            eventTitle=title,
            eventDate=date,
            startTime=start_time,
            endTime=end_time,
            organizer=organizer,
            eventDescription=description,
            location=location,
            eventStatus=event_status
        )
        db.session.add(event)
        db.session.commit()
        logger.info("Event created id=%s", event.eventID)
        return jsonify({"success": True, "message": "Event created", "eventID": event.eventID})
    except Exception:
        logger.exception("DB commit failed for event")
        db.session.rollback()
        return jsonify({"success": False, "error": "Database error"}), 500


@app.route("/request-event", methods=["POST"])
@limiter.limit("10 per hour")
def request_event():
    data = request.get_json() or {}

    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"success": False, "error": "Event title is required"}), 400
    if len(title) > 100:
        return jsonify({"success": False, "error": "Title must be 100 characters or fewer"}), 400

    description = (data.get("description") or "").strip()
    if len(description) > 500:
        return jsonify({"success": False, "error": "Description must be 500 characters or fewer"}), 400

    host = (data.get("host") or "").strip()
    if len(host) > 100:
        return jsonify({"success": False, "error": "Host name must be 100 characters or fewer"}), 400

    try:
        event_req = EventRequest(
            title=title,
            requestedDate=data.get("date") or None,
            requestedTime=data.get("time") or None,
            category=data.get("category") or None,
            host=host or None,
            description=description or None,
        )
        db.session.add(event_req)
        db.session.commit()
        logger.info("Event request saved id=%s", event_req.requestID)
        return jsonify({"success": True, "message": "Your event request has been submitted! We'll review it soon."})
    except Exception:
        logger.exception("DB commit failed for event request")
        db.session.rollback()
        return jsonify({"success": False, "error": "Database error"}), 500


@app.route("/event-requests", methods=["GET"])
def list_event_requests():
    err = require_admin()
    if err:
        return err
    reqs = EventRequest.query.order_by(EventRequest.submittedAt.desc()).all()
    return jsonify([r.to_dict() for r in reqs])


with app.app_context():
    db.create_all()
    seed_positions()
    seed_events()
    seed_menu_items()

if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug, host="0.0.0.0", port=5000)
