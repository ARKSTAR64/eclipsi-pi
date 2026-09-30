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

# ==========================================
# ROTAS DA API DO ADMINISTRADOR
# ==========================================

# app.py
@app.route("/api/admin/stats", methods=["GET"])
def get_admin_stats():
    """Retorna métricas e contagens calculadas diretamente do banco de dados."""
    conn = get_db()
    cursor = conn.cursor()

    # Total de pacientes e médicos
    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'paciente'")
    total_pacientes = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'Médico'")
    total_medicos = cursor.fetchone()[0]

    # Contagem por especialidade
    cursor.execute("""
        SELECT LOWER(especialidade) as esp, COUNT(*) 
        FROM users 
        WHERE role = 'medico' AND especialidade IS NOT NULL AND especialidade != '' 
        GROUP BY LOWER(especialidade)
    """)
    especialidades_raw = cursor.fetchall()
    conn.close()

    especialidades = {esp: qtd for esp, qtd in especialidades_raw}

    return jsonify({
        "success": True,
        "stats": {
            "total_pacientes": total_pacientes,
            "total_medicos": total_medicos,
            "especialidades": especialidades
        }
    }), 200


@app.route("/api/admin/users/<int:user_id>", methods=["PUT"])
def update_user_by_admin(user_id):
    """Atualiza as informações de um usuário pelo Administrador."""
    data = request.get_json() or {}
    
    nome = data.get("nome")
    email = data.get("email")
    role = data.get("role")
    telefone = data.get("telefone")
    registro = data.get("registro")

    if not nome or not email or not role:
        return jsonify({"success": False, "message": "Preencha os campos obrigatórios!"}), 400

    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE users 
            SET nome = ?, email = ?, role = ?, telefone = ?, registro = ?
            WHERE id = ?
        """, (nome, email, role, telefone, registro, user_id))
        conn.commit()
        return jsonify({"success": True, "message": "Usuário atualizado com sucesso!"}), 200
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "E-mail ou registro já cadastrado."}), 400
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()


@app.route("/api/admin/users/<int:user_id>", methods=["DELETE"])
def delete_user_by_admin(user_id):
    """Remove permanentemente um usuário do banco de dados."""
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Usuário excluído com sucesso!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro ao excluir: {str(e)}"}), 500
    finally:
        conn.close()

@app.route("/api/admin/profile", methods=["PUT"])
def update_admin_profile():
    """Atualiza as credenciais (nome, email, senha) do perfil do Administrador."""
    data = request.get_json() or {}
    admin_id = data.get("id")
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")

    if not admin_id or not nome or not email:
        return jsonify({"success": False, "message": "Dados do perfil incompletos!"}), 400

    conn = get_db()
    cursor = conn.cursor()

    try:
        if senha:
            senha_hash = generate_password_hash(senha)
            cursor.execute("UPDATE users SET nome = ?, email = ?, senha = ? WHERE id = ?", (nome, email, senha_hash, admin_id))
        else:
            cursor.execute("UPDATE users SET nome = ?, email = ? WHERE id = ?", (nome, email, admin_id))
        
        conn.commit()
        return jsonify({"success": True, "message": "Perfil de administrador atualizado!"}), 200
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "E-mail já está em uso."}), 400
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()

@app.route("/api/admin/users", methods=["GET"])
def get_all_users():
    """Retorna a lista de todos os usuários cadastrados no banco de dados."""
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id, nome, email, role, telefone, registro FROM users")
        rows = cursor.fetchall()
        
        users = []
        for row in rows:
            users.append({
                "id": row[0],
                "nome": row[1],
                "email": row[2],
                "role": row[3],
                "telefone": row[4],
                "registro": row[5]
            })
            
        return jsonify({"success": True, "users": users}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()

if __name__ == "__main__":
    app.run(debug=True, port=5000)