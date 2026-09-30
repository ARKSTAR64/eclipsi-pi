import os
from flask import Flask, send_from_directory

app = Flask(__name__)

# ==========================================
# ROTAS PARA ARQUIVOS ESTÁTICOS (CSS E JS)
# ==========================================


@app.route("/css/<path:filename>")
def serve_css(filename):
    return send_from_directory("frontend/css", filename)


@app.route("/js/<path:filename>")
def serve_js(filename):
    return send_from_directory("frontend/js", filename)


# ==========================================
# ROTA INICIAL (INDEX)
# ==========================================


@app.route("/")
def index():
    return send_from_directory("frontend", "index.html")


# ==========================================
# ROTAS EXPLÍCITAS PARA CADA PÁGINA (HTML)
# ==========================================


@app.route("/login")
@app.route("/pages/login.html")
def page_login():
    return send_from_directory("frontend/pages", "login.html")


@app.route("/cadastro-user")
@app.route("/pages/cadastro-user.html")
def page_cadastro_user():
    return send_from_directory("frontend/pages", "cadastro-user.html")


@app.route("/cadastro-medico")
@app.route("/pages/cadastro-medico.html")
def page_cadastro_medico():
    return send_from_directory("frontend/pages", "cadastro-medico.html")


@app.route("/agendamentos")
@app.route("/pages/agendamentos.html")
def page_agendamentos():
    return send_from_directory("frontend/pages", "agendamentos.html")


@app.route("/chat")
@app.route("/pages/chat.html")
def page_chat():
    return send_from_directory("frontend/pages", "chat.html")


@app.route("/pagamento")
@app.route("/pages/pagamento.html")
def page_pagamento():
    return send_from_directory("frontend/pages", "pagamento.html")


@app.route("/perfil")
@app.route("/pages/perfil.html")
def page_perfil():
    return send_from_directory("frontend/pages", "perfil.html")


@app.route("/psicologos")
@app.route("/pages/psicologos.html")
def page_psicologos():
    return send_from_directory("frontend/pages", "psicologos.html")


@app.route("/quiz")
@app.route("/pages/quiz.html")
def page_quiz():
    return send_from_directory("frontend/pages", "quiz.html")


@app.route("/user")
@app.route("/pages/user.html")
def page_user():
    return send_from_directory("frontend/pages", "user.html")

@app.route("/images/<path:filename>")
def serve_images(filename):
    return send_from_directory("frontend/images", filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000)