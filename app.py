import os
import sys
import psycopg2
from flask import Flask, send_from_directory, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

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
    
    cursor.execute("SELECT id, nome, email, senha, role FROM users WHERE email = %s", (email,))
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
            VALUES (%s, %s, %s, %s, %s, %s, 'paciente')
        ''', (nome, email, idade, telefone, genero, senha_hash))
        conn.commit()
        return jsonify({"success": True, "message": "Paciente cadastrado com sucesso!"}), 201
    except psycopg2.IntegrityError:
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
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'medico')
        ''', (nome, email, telefone, especialidade, registro, uf, senha_hash, descricao))
        conn.commit()
        return jsonify({"success": True, "message": "Profissional cadastrado com sucesso!"}), 201
    except psycopg2.IntegrityError:
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
    try:
        cursor = conn.cursor()

        cursor.execute("SELECT LOWER(role), COUNT(*) FROM users GROUP BY LOWER(role)")
        por_role = dict(cursor.fetchall())

        cursor.execute("""
            SELECT LOWER(TRIM(especialidade)), COUNT(*) FROM users
            WHERE LOWER(role) = 'medico' AND especialidade IS NOT NULL AND TRIM(especialidade) != ''
            GROUP BY 1 ORDER BY 2 DESC
        """)
        especialidades = dict(cursor.fetchall())

        cursor.execute("""
            WITH p AS (SELECT *, criado_em AT TIME ZONE 'America/Recife' AS t
                       FROM pagamentos WHERE status = 'pago'),
                 ref AS (SELECT now() AT TIME ZONE 'America/Recife' AS agora)
            SELECT
              COALESCE(SUM(valor) FILTER (WHERE date_trunc('month', t) = date_trunc('month', agora)), 0),
              COALESCE(SUM(valor) FILTER (WHERE date_trunc('month', t) = date_trunc('month', agora) - interval '1 month'), 0),
              COALESCE(SUM(valor) FILTER (WHERE date_trunc('year', t) = date_trunc('year', agora)), 0),
              COALESCE(SUM(taxa_plataforma) FILTER (WHERE date_trunc('year', t) = date_trunc('year', agora)), 0),
              COALESCE(SUM(repasse) FILTER (WHERE date_trunc('year', t) = date_trunc('year', agora)), 0)
            FROM p, ref
        """)
        mes, ant, ano, taxa, repasse = map(float, cursor.fetchone())

        return jsonify({"success": True, "stats": {
            "total_pacientes": por_role.get("paciente", 0),
            "total_medicos": por_role.get("medico", 0),
            "especialidades": especialidades,
            "receita": {
                "ano_ref": datetime.now().year,
                "mes_atual": mes, "ano": ano,
                "taxa_ano": taxa, "repasse_ano": repasse,
                "variacao_pct": round((mes - ant) / ant * 100, 1) if ant > 0 else None
            }
        }}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()

@app.route("/api/admin/users/<int:user_id>", methods=["PUT"])
def update_user_by_admin(user_id):
    """Atualiza as informações de um usuário pelo Administrador."""
    data = request.get_json() or {}
    
    nome = data.get("nome")
    email = data.get("email")
    role = (data.get("role") or "").strip().lower().replace("é", "e")
    telefone = data.get("telefone")
    registro = data.get("registro")

    if not nome or not email or not role:
        return jsonify({"success": False, "message": "Preencha os campos obrigatórios!"}), 400

    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE users 
            SET nome = %s, email = %s, role = %s, telefone = %s, registro = %s
            WHERE id = %s
        """, (nome, email, role, telefone, registro, user_id))
        conn.commit()
        return jsonify({"success": True, "message": "Usuário atualizado com sucesso!"}), 200
    except psycopg2.IntegrityError:
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
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
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
            cursor.execute("UPDATE users SET nome = %s, email = %s, senha = %s WHERE id = %s", (nome, email, senha_hash, admin_id))
        else:
            cursor.execute("UPDATE users SET nome = %s, email = %s WHERE id = %s", (nome, email, admin_id))
        
        conn.commit()
        return jsonify({"success": True, "message": "Perfil de administrador atualizado!"}), 200
    except psycopg2.IntegrityError:
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
        q = (request.args.get("q") or "").strip()[:100]
        role = (request.args.get("role") or "").lower()
        esp = (request.args.get("esp") or "").lower()
        where, params = [], []
        if q:
            where.append("(nome ILIKE %s OR email ILIKE %s)")
            params += [f"%{q}%", f"%{q}%"]
        if role in ("paciente", "medico", "admin"):
            where.append("LOWER(role) = %s")
            params.append(role)
        if esp:
            where.append("LOWER(especialidade) = %s")
            params.append(esp)

        sql = "SELECT id, nome, email, LOWER(role), telefone, registro, especialidade FROM users"
        if where:
            sql += " WHERE " + " AND ".join(where)
        sql += " ORDER BY nome"
        cursor.execute(sql, params)
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

@app.route("/api/admin/profile", methods=["GET"])
def get_admin_profile():
    admin_id = request.args.get("id", type=int)
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, nome, email FROM users WHERE id = %s AND LOWER(role) = 'admin'", (admin_id,))
        r = cursor.fetchone()
        if not r:
            return jsonify({"success": False, "message": "Administrador não encontrado."}), 404
        return jsonify({"success": True, "admin": {"id": r[0], "nome": r[1], "email": r[2]}}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()
LIMITES_PERFIL = {"nome": 100, "email": 254, "telefone": 11, "genero": 30, "descricao": 500,
                  "especialidade": 30, "registro": 20, "uf": 2}
CAMPOS_PERFIL = ["nome", "email", "telefone", "genero", "descricao", "idade",
                 "especialidade", "registro", "uf", "valor_hora"]


def _doctor_dict(r):
    return {"id": r[0], "nome": r[1], "especialidade": r[2], "registro": r[3], "uf": r[4],
            "descricao": r[5], "valor_hora": float(r[6]) if r[6] is not None else None}


@app.route("/api/doctors", methods=["GET"])
def list_doctors():
    q = (request.args.get("q") or "").strip()[:100]
    esp = (request.args.get("esp") or "").strip().lower()
    where, params = ["LOWER(role) = 'medico'"], []
    if q:
        where.append("(nome ILIKE %s OR COALESCE(descricao,'') ILIKE %s OR COALESCE(registro,'') ILIKE %s)")
        params += [f"%{q}%"] * 3
    if esp:
        where.append("LOWER(especialidade) = %s")
        params.append(esp)
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, nome, especialidade, registro, uf, descricao, valor_hora FROM users WHERE "
                       + " AND ".join(where) + " ORDER BY nome", params)
        return jsonify({"success": True, "doctors": [_doctor_dict(r) for r in cursor.fetchall()]}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()


@app.route("/api/doctors/<int:doctor_id>", methods=["GET"])
def get_doctor(doctor_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, nome, especialidade, registro, uf, descricao, valor_hora FROM users "
                       "WHERE id = %s AND LOWER(role) = 'medico'", (doctor_id,))
        r = cursor.fetchone()
        if not r:
            return jsonify({"success": False, "message": "Profissional não encontrado."}), 404
        return jsonify({"success": True, "doctor": _doctor_dict(r)}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()


@app.route("/api/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("""SELECT id, nome, email, telefone, idade, genero, descricao, LOWER(role),
                                 especialidade, registro, uf, valor_hora
                          FROM users WHERE id = %s""", (user_id,))
        r = cursor.fetchone()
        if not r:
            return jsonify({"success": False, "message": "Usuário não encontrado."}), 404
        return jsonify({"success": True, "profile": {
            "id": r[0], "nome": r[1], "email": r[2], "telefone": r[3], "idade": r[4],
            "genero": r[5], "descricao": r[6], "role": r[7], "especialidade": r[8],
            "registro": r[9], "uf": r[10],
            "valor_hora": float(r[11]) if r[11] is not None else None}}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()


@app.route("/api/profile/<int:user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.get_json() or {}
    sets, params = [], []
    for campo in CAMPOS_PERFIL:
        if campo not in data:
            continue
        valor = data[campo]
        if isinstance(valor, str):
            valor = valor.strip()
            if campo == "telefone":
                valor = "".join(ch for ch in valor if ch.isdigit())
            if len(valor) > LIMITES_PERFIL.get(campo, 1000):
                return jsonify({"success": False, "message": f"Campo '{campo}' muito longo."}), 400
            valor = valor or None
        if campo in ("nome", "email") and not valor:
            return jsonify({"success": False, "message": "Nome e e-mail são obrigatórios."}), 400
        sets.append(f"{campo} = %s")
        params.append(valor)
    if data.get("senha"):
        if not 8 <= len(data["senha"]) <= 64:
            return jsonify({"success": False, "message": "A senha deve ter entre 8 e 64 caracteres."}), 400
        sets.append("senha = %s")
        params.append(generate_password_hash(data["senha"]))
    if not sets:
        return jsonify({"success": False, "message": "Nada para atualizar."}), 400

    params.append(user_id)
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET " + ", ".join(sets) + " WHERE id = %s", params)
        conn.commit()
        return jsonify({"success": True, "message": "Perfil atualizado!"}), 200
    except psycopg2.IntegrityError:
        conn.rollback()
        return jsonify({"success": False, "message": "E-mail ou registro já cadastrado."}), 400
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500
    finally:
        conn.close()
        
if __name__ == "__main__":
    app.run(debug=True, port=5000)