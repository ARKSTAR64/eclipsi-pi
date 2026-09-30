import os
import sys
import sqlite3
from flask import Flask, send_from_directory, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
PAGES_DIR = os.path.join(FRONTEND_DIR, "pages")

sys.path.append(os.path.join(BASE_DIR, 'backend'))
from database import init_db, get_db

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

init_db()

# ==========================================
# ROTAS DE FRONTEND
# ==========================================

@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/pages/<path:page_name>")
def serve_pages(page_name):
    if not page_name.endswith(".html"):
        page_name += ".html"
    return send_from_directory(PAGES_DIR, page_name)

@app.route("/<path:page_name>")
def serve_direct_html(page_name):
    page_name_html = page_name if page_name.endswith(".html") else page_name + ".html"

    if os.path.exists(os.path.join(PAGES_DIR, page_name_html)):
        return send_from_directory(PAGES_DIR, page_name_html)
    
    return send_from_directory(FRONTEND_DIR, page_name)

# ==========================================
# ROTAS DE API (AUTENTICAÇÃO E CADASTRO)
# ==========================================

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"success": False, "message": "Preencha e-mail e senha!"}), 400

    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, nome, email, senha, role FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"success": False, "message": "E-mail ou senha incorretos!"}), 401

    user_id, nome, user_email, senha_hash, role = user

    if not check_password_hash(senha_hash, senha):
        return jsonify({"success": False, "message": "E-mail ou senha incorretos!"}), 401

    # Redireciona conforme a permissão (role) gravada no banco
    redirect_map = {
        "admin": "/pages/admin.html",
        "medico": "/pages/medico.html",
        "paciente": "/pages/user.html"
    }

    redirect_url = redirect_map.get(role, "/pages/user.html")

    return jsonify({
        "success": True,
        "message": "Login realizado com sucesso!",
        "redirect_url": redirect_url,
        "user": {
            "id": user_id,
            "nome": nome,
            "email": user_email,
            "role": role
        }
    }), 200

@app.route("/api/register/user", methods=["POST"])
def register_user():
    data = request.get_json() or {}
    
    nome = data.get("nome")
    email = data.get("email")
    idade = data.get("idade")
    telefone = data.get("telefone")
    genero = data.get("genero")
    senha = data.get("senha")

    if not nome or not email or not senha:
        return jsonify({"success": False, "message": "Preencha os campos obrigatórios!"}), 400

    senha_hash = generate_password_hash(senha)

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO users (nome, email, idade, telefone, genero, senha, role)
            VALUES (?, ?, ?, ?, ?, ?, 'paciente')
        ''', (nome, email, idade, telefone, genero, senha_hash))
        conn.commit()
        return jsonify({"success": True, "message": "Paciente cadastrado com sucesso!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "Este e-mail já está cadastrado."}), 400
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()

@app.route("/api/register/doctor", methods=["POST"])
def register_doctor():
    data = request.get_json() or {}
    
    nome = data.get("nome")
    email = data.get("email")
    telefone = data.get("telefone")
    especialidade = data.get("especialidade")
    registro = data.get("registro")
    uf = data.get("uf")
    senha = data.get("senha")
    descricao = data.get("descricao")

    if not nome or not email or not registro or not senha:
        return jsonify({"success": False, "message": "Preencha os campos obrigatórios!"}), 400

    senha_hash = generate_password_hash(senha)

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO users (nome, email, telefone, especialidade, registro, uf, senha, descricao, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'medico')
        ''', (nome, email, telefone, especialidade, registro, uf, senha_hash, descricao))
        conn.commit()
        return jsonify({"success": True, "message": "Profissional cadastrado com sucesso!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "E-mail ou registro profissional já cadastrado."}), 400
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()

if __name__ == "__main__":
    app.run(debug=True, port=5000)