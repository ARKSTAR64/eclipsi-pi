import sqlite3
import os

# Caminho absoluto para a raiz do projeto e para a pasta 'database'
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_FOLDER = os.path.join(BASE_DIR, 'database')

# Cria a pasta 'database' automaticamente na raiz se ela não existir
os.makedirs(DB_FOLDER, exist_ok=True)

# Caminho completo do arquivo SQLite dentro da pasta criada
DB_PATH = os.path.join(DB_FOLDER, 'database.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Tabela unificada de usuários
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            telefone TEXT,
            role TEXT NOT NULL, -- 'paciente', 'medico', 'admin'
            
            -- Campos do Paciente
            idade INTEGER,
            genero TEXT,
            
            -- Campos do Médico/Profissional
            especialidade TEXT,
            registro TEXT,
            uf TEXT,
            descricao TEXT,
            
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Usuário ADM temporário para testes
    cursor.execute("SELECT id FROM users WHERE email = ?", ("adm@adm",))
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (nome, email, senha, role)
            VALUES (?, ?, ?, ?)
        ''', ("Administrador", "adm@adm", "123", "admin"))
        print("👤 Usuário ADM criado: adm@adm | senha: 123")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()