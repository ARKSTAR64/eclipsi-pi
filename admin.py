import os
import psycopg2
import sys
from werkzeug.security import generate_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR, 'backend'))

from database import init_db, get_db

# Garante que as tabelas existem
init_db()

# Dados do Administrador
ADMIN_NOME = "Administrador Principal"
ADMIN_EMAIL = "admin@saudemental.com"
ADMIN_SENHA = "admin123"  # Defina a senha que desejar para o admin

conn = get_db()
cursor = conn.cursor()

# Criptografa a senha
senha_hash = generate_password_hash(ADMIN_SENHA)

# Verifica se já existe um utilizador com este e-mail
cursor.execute("SELECT id FROM users WHERE email = %s", (ADMIN_EMAIL,))
user = cursor.fetchone()

if user:
    # Atualiza a senha e o perfil (role) para garantir que está com hash e como admin
    cursor.execute("""
        UPDATE users 
        SET senha = %s, role = 'admin', nome = %s 
        WHERE email = %s
    """, (senha_hash, ADMIN_NOME, ADMIN_EMAIL))
    print(f"✅ Administrador '{ADMIN_EMAIL}' ATUALIZADO com sucesso!")
else:
    # Cria o utilizador admin do zero
    cursor.execute("""
        INSERT INTO users (nome, email, senha, role)
        VALUES (%s, %s, %s, 'admin')
    """, (ADMIN_NOME, ADMIN_EMAIL, senha_hash))
    print(f"✅ Administrador '{ADMIN_EMAIL}' CRIADO com sucesso!")

conn.commit()
conn.close()