# Baseball Play Analyzer

A simple standalone web app built with Flask (Python) and React.js to filter, search, and visualize baseball play data.

## Tech Stack

- **Backend**: Flask + SQLAlchemy + SQLite
- **Frontend**: React (Vite)
- **Data**: CSV file loaded into SQLite on first run

---

## Getting Started

Follow the steps below to run the app locally.

### 1. Clone the Repository

```bash
git clone https://github.com/brandtheman50/baseball.git
cd baseball

cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py             # runs the Flask server on http://localhost:5000 and creates database

cd ../frontend
npm install
npm run dev               # runs React on http://localhost:5173
```

Notes: 
- The CSV file is located at backend/data.csv
- The Flask server reads from SQLite and serves data via API
- Styling is kept minimal to focus on functionality