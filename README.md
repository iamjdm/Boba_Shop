# TeaZen Boba Bar Website

A modern, responsive website for TeaZen Boba Bar - Find Your Zen, One Bubble at a Time.

## Project Structure

```
teazen-boba-shop/
├── index.html              # Homepage with hero banner & intro sections
├── menu.html               # Full TeaZen drink menu with product images
├── music.html              # Live events page featuring audio + artist thumbnails
├── jobs.html               # Jobs / hiring page with application form
├── gear.html               # Merch store page (shirts, banners, accessories)
├── teazen.css              # Global styling, layout, typography, responsiveness
├── app.py                  # Flask backend (API routes)
├── teazen_db.sql           # Database export (tables + sample data)
├── README.md
│
├── images/                 # All image assets used across the site
│   ├── Boba_logo.png                       # Primary full-size Teazen logo
│   ├── boba_logo_small.png                 # Small navbar/footer logo
│   ├── bubble-tea.png                      # Bubble tea product icon (menu/branding)
│   ├── bubble.webp                         # Decorative bubble graphic for accents
│   ├── boba_homehero_1.avif                # Homepage main hero image
│   ├── boba_home_banner.jpg                # Secondary homepage banner
│   ├── acoustic-guitar.webp                # Acoustic event hero image (music page)
│   ├── acoustic-guitar_thumb.webp          # Acoustic event thumbnail (music page)
│   ├── boba_merch.avif                     # Merch page main hero banner
│   ├── boba_merch_2.webp                   # Additional merch promotional image
│   ├── boba_merch_banner.webp              # Wide merch promotional banner
│   ├── boba_shirt_merch.webp               # Main T-shirt product image
│   ├── boba_jobs.jpg                       # Jobs page hero image
│   └── boba_tea_large.jpg                  # Large drink product photo (menu)
│
└── audios/                 # Audio samples used on the Music/Events page
    ├── greg.mp3                              # Acoustic artist track (MP3)
    ├── greg.ogg                              # Acoustic artist track (OGG)
    ├── kpop-demon-hunters-golden.mp3         # K-Pop Night preview (MP3)
    └── kpop-demon-hunters-golden.ogg         # K-Pop Night preview (OGG)
```

## How to Use

## Frontend (Static Pages)
### Option 1: Open Directly in Browser

Simply double-click `index.html` to open the website in your default browser.

### Option 2: Use Live Server (Recommended for Development)

If you have VS Code:

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Simple HTTP Server

Using Python (if installed):

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser

## Color Scheme

- **Deep Jade Green** (#2d5016) - Headers & accents
- **Soft Cream** (#f5f3e8) - Main background
- **Warm Terracotta** (#d1a35e) - Links & highlights
- **Charcoal** (#2b2d2e) - Navigation & text
- **Soft Sage** (#b8c5a8) - Borders & subtle accents

## Features

- Fully responsive design (mobile, tablet, desktop)
- Modern boba tea shop theme
- Events & entertainment page
- Online merchandise shop
- Job application form
- Menu with pricing and toppings

## No Dependencies Required

This is a pure HTML/CSS website with no build tools or package managers needed. Just open and run!

## Database Requirements

- MySQL Server
- MySQL Workbench

Note: If you don't have MySQL installed, download it here:
https://dev.mysql.com/downloads/ 

## Database Setup

Ensure your MySQL server is running before importing the database.

1. Open MySQL Workbench
2. Go to Server → Data Import
3. Select Import from Self-Contained File
4. Choose `teazen_db.sql`
5. Click Start Import

Note: This database file includes all tables and sample data required for the project.

## Backend Setup (Flask)

To enable features such as orders, job applications, and menu data, run the backend:

1. Open terminal in your project folder
2. Run:
```bash
python app.py
```
3. Open in browser:
`http://127.0.0.1:5000`

Note: Ensure your MySQL server is running before starting the backend.

## Contact

Email: info@teazenboba.com

---

**Note:** This project was converted from JavaJam Coffee Bar to TeaZen Boba Bar, maintaining the original responsive structure while completely reimagining the content and design for a modern boba tea shop.
