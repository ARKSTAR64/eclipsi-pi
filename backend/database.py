import psycopg2
import os
from dotenv import load_dotenv

# Caminho pro env lá pra ele entrar no banco 
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, '.env')

# Abrir conexão com o supabase lá que usa postgresql
load_dotenv(ENV_PATH)

def get_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )

def init_db():
    # já tem as tabelas ai vou só conectar aqui vo criar nada no sqlite
    
    pass
