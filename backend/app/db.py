import sqlite3
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

DB_PATH = BASE / "db" / "moment.db"


def get_connection():
    print("Database path:", DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


