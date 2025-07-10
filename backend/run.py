from app import app
from app.load_data import create_db

if __name__ == '__main__':
    create_db()
    app.run(debug=True)