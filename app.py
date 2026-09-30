from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder="frontend", static_url_path="")


# Exemplo: Servir a tela inicial
@app.route("/")
def index():
    return send_from_directory("frontend", "index.html")


if __name__ == "__main__":
    app.run(debug=True)