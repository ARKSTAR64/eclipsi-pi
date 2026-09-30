import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )

    print("✅ CONEXÃO COM O SUPABASE FUNCIONOU!")

    conn.close()

except Exception as e:
    print("❌ ERRO AO CONECTAR:")
    print(e)