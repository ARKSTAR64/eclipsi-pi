import os

# Lista de diretórios para criar
folders = [
    "backend/app/api/v1/endpoints",
    "backend/app/core",
    "backend/app/models",
    "backend/app/schemas",
    "backend/app/services",
    "mobile/assets",
    "mobile/src/components",
    "mobile/src/constants",
    "mobile/src/contexts",
    "mobile/src/hooks",
    "mobile/src/navigation",
    "mobile/src/screens/auth",
    "mobile/src/screens/patient",
    "mobile/src/screens/doctor",
    "mobile/src/screens/shared",
    "mobile/src/services",
    "mobile/src/types",
    "mobile/src/utils",
]

# Lista de arquivos base
files = [
    "backend/app/api/v1/endpoints/__init__.py",
    "backend/app/api/v1/endpoints/auth.py",
    "backend/app/api/v1/endpoints/patients.py",
    "backend/app/api/v1/endpoints/psychologists.py",
    "backend/app/api/v1/endpoints/quiz.py",
    "backend/app/api/v1/endpoints/appointments.py",
    "backend/app/api/v1/endpoints/reports.py",
    "backend/app/api/v1/router.py",
    "backend/app/core/config.py",
    "backend/app/core/database.py",
    "backend/app/core/security.py",
    "backend/app/main.py",
    "backend/.env",
    "backend/requirements.txt",
    "backend/Dockerfile",
    "mobile/App.tsx",
    "mobile/package.json",
]

print("Criando estrutura do projeto...")

# Criar pastas
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# Criar arquivos vazios
for file_path in files:
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            pass

print("Estrutura gerada com sucesso!")