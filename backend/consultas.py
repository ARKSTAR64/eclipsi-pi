from datetime import datetime, timezone
import psycopg2
from flask import Blueprint, request, jsonify
from database import get_db

bp = Blueprint("consultas", __name__)

LIM = {"nome": 100, "email": 254, "telefone": 11, "genero": 30, "descricao": 500,
       "especialidade": 30, "registro": 20, "uf": 2}


def validar_cadastro(data):
    """Usar nas rotas /api/register/*. Retorna mensagem de erro ou None."""
    for campo, maximo in LIM.items():
        v = data.get(campo)
        if isinstance(v, str):
            if campo == "telefone":
                v = "".join(c for c in v if c.isdigit())
                data[campo] = v
            if len(v.strip()) > maximo:
                return f"O campo '{campo}' passou do limite de {maximo} caracteres."
    if "@" not in (data.get("email") or ""):
        return "E-mail inválido."
    if not 8 <= len(data.get("senha") or "") <= 64:
        return "A senha deve ter entre 8 e 64 caracteres."
    return None


def _erro(e, status=500):
    return jsonify({"success": False, "message": f"Erro interno: {e}"}), status


@bp.route("/api/consultas", methods=["POST"])
def criar_consulta():
    d = request.get_json() or {}
    try:
        pid, mid = int(d["paciente_id"]), int(d["medico_id"])
        dh = datetime.fromisoformat(str(d["data_hora"]).replace("Z", "+00:00"))
    except (KeyError, ValueError, TypeError):
        return jsonify({"success": False, "message": "Dados da consulta inválidos."}), 400
    if dh.tzinfo and dh <= datetime.now(timezone.utc):
        return jsonify({"success": False, "message": "Escolha uma data futura."}), 400
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("""INSERT INTO consultas (paciente_id, medico_id, data_hora, valor)
                       SELECT %s, id, %s, COALESCE(valor_hora, 0) FROM users
                       WHERE id = %s AND LOWER(role) = 'medico' RETURNING id""", (pid, dh, mid))
        row = cur.fetchone()
        if not row:
            conn.rollback()
            return jsonify({"success": False, "message": "Profissional não encontrado."}), 404
        conn.commit()
        return jsonify({"success": True, "id": row[0], "message": "Consulta agendada!"}), 201
    except psycopg2.IntegrityError:
        conn.rollback()
        return jsonify({"success": False, "message": "Paciente inválido."}), 400
    except Exception as e:
        conn.rollback()
        return _erro(e)
    finally:
        conn.close()


@bp.route("/api/consultas", methods=["GET"])
def listar_consultas():
    pid = request.args.get("paciente_id", type=int)
    mid = request.args.get("medico_id", type=int)
    if not pid and not mid:
        return jsonify({"success": False, "message": "Informe paciente_id ou medico_id."}), 400
    col, val = ("c.paciente_id", pid) if pid else ("c.medico_id", mid)
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(f"""SELECT c.id, c.data_hora, c.valor, c.status, c.anotacoes,
                               c.medico_id, m.nome, m.especialidade,
                               c.paciente_id, p.nome, p.descricao,
                               EXISTS(SELECT 1 FROM avaliacoes a WHERE a.consulta_id = c.id)
                        FROM consultas c
                        JOIN users m ON m.id = c.medico_id
                        JOIN users p ON p.id = c.paciente_id
                        WHERE {col} = %s ORDER BY c.data_hora""", (val,))
        out = [{"id": r[0], "data_hora": r[1].isoformat(), "valor": float(r[2]), "status": r[3],
                "anotacoes": r[4], "medico_id": r[5], "medico_nome": r[6], "especialidade": r[7],
                "paciente_id": r[8], "paciente_nome": r[9], "paciente_bio": r[10], "avaliada": r[11]}
               for r in cur.fetchall()]
        return jsonify({"success": True, "consultas": out}), 200
    except Exception as e:
        return _erro(e)
    finally:
        conn.close()


@bp.route("/api/consultas/<int:cid>", methods=["PATCH"])
def atualizar_consulta(cid):
    d = request.get_json() or {}
    sets, params = [], []
    if "status" in d:
        if d["status"] not in ("agendada", "realizada", "cancelada"):
            return jsonify({"success": False, "message": "Status inválido."}), 400
        sets.append("status = %s"); params.append(d["status"])
    if "anotacoes" in d:
        txt = (d["anotacoes"] or "").strip()
        if len(txt) > 5000:
            return jsonify({"success": False, "message": "Anotação muito longa."}), 400
        sets.append("anotacoes = %s"); params.append(txt or None)
    if not sets:
        return jsonify({"success": False, "message": "Nada para atualizar."}), 400
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("UPDATE consultas SET " + ", ".join(sets) + " WHERE id = %s", params + [cid])
        conn.commit()
        return jsonify({"success": True, "message": "Consulta atualizada!"}), 200
    except Exception as e:
        conn.rollback()
        return _erro(e)
    finally:
        conn.close()


@bp.route("/api/medico/<int:mid>/ganhos", methods=["GET"])
def ganhos(mid):
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("""
            WITH c AS (SELECT valor, data_hora AT TIME ZONE 'America/Recife' AS t
                       FROM consultas WHERE medico_id = %s AND status = 'realizada'),
                 ref AS (SELECT now() AT TIME ZONE 'America/Recife' AS agora)
            SELECT
              COALESCE(SUM(valor) FILTER (WHERE date_trunc('month', t) = date_trunc('month', agora)), 0),
              COALESCE(SUM(valor) FILTER (WHERE date_trunc('month', t) = date_trunc('month', agora) - interval '1 month'), 0),
              COALESCE(SUM(valor) FILTER (WHERE date_trunc('year', t) = date_trunc('year', agora)), 0),
              COUNT(*) FILTER (WHERE date_trunc('year', t) = date_trunc('year', agora))
            FROM c, ref""", (mid,))
        mes, ant, ano, qtd = cur.fetchone()
        mes, ant, ano = float(mes), float(ant), float(ano)
        return jsonify({"success": True, "mes": mes, "ano": ano, "consultas_ano": qtd,
                        "variacao_pct": round((mes - ant) / ant * 100, 1) if ant > 0 else None}), 200
    except Exception as e:
        return _erro(e)
    finally:
        conn.close()


@bp.route("/api/avaliacoes", methods=["POST"])
def avaliar():
    d = request.get_json() or {}
    try:
        cid, nota = int(d["consulta_id"]), int(d["nota"])
    except (KeyError, ValueError, TypeError):
        return jsonify({"success": False, "message": "Dados inválidos."}), 400
    if not 1 <= nota <= 5:
        return jsonify({"success": False, "message": "A nota vai de 1 a 5."}), 400
    com = (d.get("comentario") or "").strip()[:500] or None
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("""INSERT INTO avaliacoes (consulta_id, medico_id, paciente_id, nota, comentario)
                       SELECT id, medico_id, paciente_id, %s, %s FROM consultas
                       WHERE id = %s AND status = 'realizada' RETURNING id""", (nota, com, cid))
        if not cur.fetchone():
            conn.rollback()
            return jsonify({"success": False, "message": "Só dá para avaliar consultas realizadas."}), 400
        conn.commit()
        return jsonify({"success": True, "message": "Avaliação registrada!"}), 201
    except psycopg2.IntegrityError:
        conn.rollback()
        return jsonify({"success": False, "message": "Esta consulta já foi avaliada."}), 400
    except Exception as e:
        conn.rollback()
        return _erro(e)
    finally:
        conn.close()


@bp.route("/api/avaliacoes/resumo", methods=["GET"])
def resumo_avaliacoes():
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("SELECT medico_id, ROUND(AVG(nota), 1), COUNT(*) FROM avaliacoes GROUP BY medico_id")
        return jsonify({"success": True, "resumo": {str(r[0]): {"media": float(r[1]), "total": r[2]}
                                                    for r in cur.fetchall()}}), 200
    except Exception as e:
        return _erro(e)
    finally:
        conn.close()


@bp.route("/api/profile/<int:uid>", methods=["DELETE"])
def excluir_conta(uid):
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM users WHERE id = %s AND LOWER(role) != 'admin'", (uid,))
        conn.commit()
        return jsonify({"success": True, "message": "Conta excluída."}), 200
    except Exception as e:
        conn.rollback()
        return _erro(e)
    finally:
        conn.close()