# TeaZen Boba Bar

A modern, responsive website for TeaZen Boba Bar — *Find Your Zen, One Bubble at a Time.*

The site is fully connected to a MySQL database for live menu, orders, events, and job applications, and includes an AI assistant powered by a locally running Ollama model.

---

## Project Structure

```
teazen-boba-shop/
│
├── index.html              # Homepage — hero banner, intro, AI chatbot widget
├── menu.html               # Menu page — drinks, snacks, merch fetched from DB
├── order.html              # Order page — cart, checkout, AI cart summary
├── events.html             # Events calendar — loaded from DB
├── jobs.html               # Jobs page — open positions from DB, application form
│
├── scripts/
│   ├── events.js           # Calendar rendering, DB event fetch
│   ├── jobs.js             # Job positions fetch, application form submission
│   └── order.js            # Cart logic, checkout, AI order summary
│
├── styles/
│   ├── teazen.css          # Global layout, typography, responsiveness, chatbot UI
│   ├── events.css          # Events calendar styles
│   ├── jobs.css            # Job application form styles
│   ├── menu.css            # Menu page styles
│   ├── order.css           # Order page styles
│   └── index.css           # Homepage styles
│
├── backend/
│   ├── app.py              # Flask backend — all API routes
│   ├── menu_data.json      # AI knowledge source for menu items
│   ├── prompt.txt          # AI system prompt for TeaZen assistant behavior
│   └── teazen_db.sql       # Full database export (tables + sample data)
│
├── images/                 # All image assets
└── audios/                 # Audio samples for events
```

---

## Prerequisites

| Tool | Purpose | Download |
|---|---|---|
| MySQL Server 8.0+ | Database | https://dev.mysql.com/downloads/ |
| MySQL Workbench | DB import/management | Included with MySQL installer |
| Python 3.9+ | Run the Flask backend | https://www.python.org/downloads/ |
| Ollama | Run the AI model locally | https://ollama.com/download |

---

## Full Setup Guide

### 1. Database Setup

Ensure your MySQL server is running before importing.

1. Open **MySQL Workbench**
2. Go to **Server → Data Import**
3. Select **Import from Self-Contained File**
4. Choose `backend/teazen_db.sql`
5. Under **Default Target Schema**, create or select a schema named `boba_shop_db`
6. Click **Start Import**

This imports all tables and sample data:
- `menuitem` — drinks, snacks, merch
- `orders` + `orderdetails` — customer orders
- `events` — calendar events
- `jobpositions` + `jobapplications` — hiring

---

### 2. Python Environment Setup

Open a terminal in the `backend/` folder:

```bash
cd backend
pip install flask flask-cors flask-sqlalchemy pymysql requests python-dotenv
```

---

### 3. Environment Variables

Create a file called `.env` inside the `backend/` folder:

```
DB_PASSWORD=your_mysql_root_password
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=your_model_name
```

- `DB_PASSWORD` — your MySQL root password (leave blank if none)
- `OLLAMA_URL` — default Ollama endpoint, no change needed unless running remotely
- `OLLAMA_MODEL` — the name of the Ollama model you pulled (see step 4)

---

### 4. Ollama AI Setup

1. Download and install Ollama from https://ollama.com/download
2. Pull a model (example):
```bash
ollama pull llama3
```
3. Set `OLLAMA_MODEL=llama3` in your `.env` (match whatever model you pulled)
4. Ollama runs automatically in the background after installation

The AI assistant uses `menu_data.json` and `prompt.txt` as its knowledge source — it does not query the database directly. To update what the AI knows, edit those two files.

---

### 5. Run the Backend

From the `backend/` folder:

```bash
python app.py
```

The backend will:
- Connect to MySQL
- Create any missing tables automatically
- Seed default job positions if the table is empty
- Start serving on `http://127.0.0.1:5000`

> Make sure MySQL is running before starting the backend.

---

### 6. Open the Website

Open `index.html` directly in your browser, or use VS Code Live Server:

1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**

> The frontend expects the Flask backend running at `http://127.0.0.1:5000`. Without it, the menu, orders, events, and jobs pages will not load data.

---

## Features

### Database-Connected Pages

| Page | What it reads | What it writes |
|---|---|---|
| `menu.html` | Menu items grouped by category | — |
| `order.html` | Menu items for the cart | Orders + order details on checkout |
| `events.html` | Events displayed on calendar | — |
| `jobs.html` | Open job positions | Job applications |

### AI-Powered Features

| Feature | Page | How it works |
|---|---|---|
| TeaZen Chatbot | `index.html` | Ask questions about the menu, events, jobs, allergens |
| AI Cart Summary | `order.html` | Sends cart to AI for a friendly order summary |

The AI uses `menu_data.json` (menu knowledge) and `prompt.txt` (behavior rules) — not the live database. Update those files to change what the AI knows.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/menu-items` | All menu items |
| GET | `/events` | All events ordered by date |
| POST | `/submit-event` | Create a new event |
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
