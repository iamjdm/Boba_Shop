# TeaZen Boba Bar

A modern, responsive website for TeaZen Boba Bar — *Find Your Zen, One Bubble at a Time.*

The site is fully connected to a MySQL database for live menu, orders, events, and job applications, and includes an AI assistant powered by a locally running Ollama model.

---

## Project Structure

```
teazen-boba-shop/
│
├── index.html              # Homepage — hero banner, intro
├── menu.html               # Menu page — drinks, snacks, merch fetched from DB
├── order.html              # Order page — cart, checkout, AI cart summary & chatbot
├── events.html             # Events calendar — loaded from DB, RSVP form
├── jobs.html               # Jobs page — open positions from DB, application form
│
├── scripts/
│   ├── events.js           # Calendar rendering, DB event fetch, RSVP & event submission
│   ├── jobs.js             # Job positions fetch, application form submission
│   └── order.js            # Cart logic, checkout, AI order summary & chatbot
│
├── styles/
│   ├── teazen.css          # Global layout, typography, responsiveness
│   ├── events.css          # Events calendar and RSVP styles
│   ├── jobs.css            # Job application form styles
│   ├── menu.css            # Menu page styles
│   ├── order.css           # Order page and chatbot styles
│   └── index.css           # Homepage styles
│
├── backend/
│   ├── app.py              # Flask backend — all API routes
│   ├── menu_data.json      # AI knowledge source for menu items
│   ├── prompt.txt          # AI system prompt for TeaZen assistant behavior
│   ├── teazen_db.sql       # Full database export (tables + sample data)
│   └── .env                # Environment variables (not committed)
│
├── images/                 # All image assets
└── audios/                 # Audio samples for events
```

---

## Prerequisites

Install these before starting:

| Tool | Install |
|---|---|
| Homebrew | `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` |
| MySQL | `brew install mysql` |
| Python 3 | `brew install python` |
| Ollama | `brew install ollama` |

---

## Full Setup Guide

### 1. Start MySQL and Import the Database

```bash
brew services start mysql
mysql -u root -e "CREATE DATABASE IF NOT EXISTS boba_shop_db;"
mysql -u root boba_shop_db < backend/teazen_db.sql
```

This imports all tables and sample data:
- `menuitem` — drinks, snacks, merch
- `orders` + `orderdetails` — customer orders
- `events` + `event_attendees` — calendar events and RSVPs
- `jobpositions` + `jobapplications` — hiring

---

### 2. Create the `.env` File

Create a file called `.env` inside the `backend/` folder:

```
DB_PASSWORD=
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3.2
```

- `DB_PASSWORD` — leave blank if your MySQL root has no password
- `OLLAMA_URL` — default Ollama endpoint, no change needed
- `OLLAMA_MODEL` — must match the model you pull in step 3

---

### 3. Ollama AI Setup

```bash
brew services start ollama
ollama pull llama3.2
```

Ollama runs in the background automatically after `brew services start ollama`. The AI assistant uses `menu_data.json` and `prompt.txt` as its knowledge source — it does not query the database directly.

---

### 4. Python Virtual Environment Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors flask-sqlalchemy pymysql requests python-dotenv
```

> Each time you return to run the backend, activate the venv first:
> ```bash
> source venv/bin/activate
> ```

---

### 5. Run the Backend

From the `backend/` folder with the venv active:

```bash
python3 app.py
```

The backend will:
- Connect to MySQL
- Create any missing tables automatically (`event_attendees` is created here)
- Seed default job positions if the table is empty
- Start serving on `http://127.0.0.1:5000`

> Make sure MySQL and Ollama are running before starting the backend.

---

### 6. Open the Website

Open `index.html` with VS Code Live Server:

1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**

> The frontend expects the Flask backend at `http://127.0.0.1:5000`. Without it, the menu, orders, events, and jobs pages will not load data.

> **macOS note:** If port 5000 is blocked, go to **System Settings → General → AirDrop & Handoff** and turn off **AirPlay Receiver**.

---

## Features

### Database-Connected Pages

| Page | What it reads | What it writes |
|---|---|---|
| `menu.html` | Menu items grouped by category | — |
| `order.html` | Menu items for the cart | Orders + order details on checkout |
| `events.html` | Events displayed on calendar | RSVPs, new events via submission form |
| `jobs.html` | Open job positions | Job applications |

### AI-Powered Features

| Feature | Page | How it works |
|---|---|---|
| TeaZen Chatbot | `order.html` | Ask questions about the menu, events, jobs, allergens |
| AI Cart Summary | `order.html` | Sends cart to AI for a friendly order summary |

The AI uses `menu_data.json` (menu knowledge) and `prompt.txt` (behavior rules) — not the live database. Update those files to change what the AI knows.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/menu-items` | All menu items |
| GET | `/events` | All events ordered by date |
| POST | `/submit-event` | Create a new event |
| POST | `/api/rsvp` | RSVP for an event |
| GET | `/job-positions` | All job positions |
| GET | `/applications` | All submitted job applications |
| POST | `/submit-job` | Submit a job application |
| POST | `/submit-order` | Submit a customer order |
| POST | `/api/chat` | AI chatbot message |
| POST | `/api/order-ai` | AI cart summary |

---

## Color Scheme

| Name | Hex | Used For |
|---|---|---|
| Deep Jade Green | `#2d5016` | Headers, buttons, accents |
| Soft Cream | `#f5f3e8` | Main background |
| Warm Terracotta | `#d1a35e` | Links, highlights |
| Charcoal | `#2b2d2e` | Navigation, body text |
| Soft Sage | `#b8c5a8` | Borders, subtle accents |

---

## Contact

Email: info@teazenboba.com
