import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", ".env"))

try:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"), port=os.getenv("DB_PORT"), dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"), password=os.getenv("DB_PASSWORD"),
    )
    print("✅ Conexão com o Supabase OK")
    conn.close()
except Exception as e:
    print("❌ Erro ao conectar:", e)
