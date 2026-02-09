import sqlite3
from pathlib import Path

# Path setup
BASE = Path(__file__).resolve().parent.parent
DB_DIR = BASE / "db"
DB_PATH = DB_DIR / "moment.db"

def init_db():
    """Ensures the directory and the jobs table exist."""
    # 1. Create directory if missing
    DB_DIR.mkdir(parents=True, exist_ok=True)
    
    # 2. Connect and create table
    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.cursor()
    
    # This matches the columns in your main.py create_job function
    cur.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            job_id TEXT PRIMARY KEY,
            video_url TEXT NOT NULL,
            content_type TEXT,
            intent TEXT,
            tone TEXT,
            status TEXT,
            created_at TEXT,
            result_data TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def get_connection():
    # Always check/init before connecting
    init_db()
    
    print("Database path:", DB_PATH)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn
