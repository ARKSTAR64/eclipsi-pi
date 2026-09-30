import os

# Lista de pastas a serem criadas
folders = [
    "backend",
    "frontend/css",
    "frontend/js",
    "frontend/pages",
]

# Lista de arquivos a serem criados
files = [
    # Arquivos do Backend (Flask + SQLite/Supabase)
    "backend/app.py",
    "backend/config.py",
    "backend/database.py",
    "backend/services.py",
    "backend/.env",
    "backend/requirements.txt",
    
    # Arquivo Raiz do Frontend
    "frontend/index.html",
    
    # CSS Global e Específicos por Tela
    "frontend/css/global.css",
    "frontend/css/login.css",
    "frontend/css/cadastro.css",
    "frontend/css/quiz.css",
    "frontend/css/psicologos.css",
    "frontend/css/perfil.css",
    "frontend/css/agendamentos.css",
    "frontend/css/chat.css",
    
    # JavaScripts
    "frontend/js/api.js",
    "frontend/js/quiz.js",
    "frontend/js/app.js",
    
    # Páginas HTML do Aplicativo
    "frontend/pages/login.html",
    "frontend/pages/cadastro.html",
    "frontend/pages/quiz.html",
    "frontend/pages/psicologos.html",
    "frontend/pages/perfil.html",
    "frontend/pages/agendamentos.html",
    "frontend/pages/chat.html",
]

print("📁 Criando diretórios...")
for folder in folders:
    os.makedirs(folder, exist_ok=True)
    print(f"  [+] Pasta: {folder}")

print("\n📄 Criando arquivos vazios...")
for file_path in files:
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            pass
        print(f"  [+] Arquivo: {file_path}")
    else:
        print(f"  [=] Arquivo já existe: {file_path}")

print("\n✅ Estrutura completa gerada com sucesso!")