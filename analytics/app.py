import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="AlertFlow Analytics", version="0.1.0")

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/metrics/summary")
def summary():
    try:
        with psycopg.connect(DB_URL) as conn, conn.cursor() as cur:
            cur.execute("SELECT status, COUNT(*) FROM reports GROUP BY status")
            rows = cur.fetchall()
        return {"by_status": {r[0]: r[1] for r in rows}}
    except Exception:
        return {"by_status": {}}
