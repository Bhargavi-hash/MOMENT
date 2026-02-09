import sqlite3
from pathlib import Path
import os

BASE = Path(__file__).resolve().parent.parent
# Ensure the folder is clearly defined
DB_DIR = BASE / "db"
DB_PATH = DB_DIR / "moment.db"

def get_connection():
    # --- ADD THIS LINE ---
    # This creates the /db folder if it doesn't exist
    DB_DIR.mkdir(parents=True, exist_ok=True)
    
    print("Database path:", DB_PATH)
    conn = sqlite3.connect(str(DB_PATH)) # Convert Path to string for sqlite3
    conn.row_factory = sqlite3.Row
    return conn
