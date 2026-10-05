# EcliPsi — PWA de saúde mental

Agendamento de consultas entre pacientes e profissionais (paciente, médico/psicólogo e admin).
Stack: Flask + Supabase (PostgreSQL) + HTML/CSS/JS puro, instalável como PWA.

## Rodar
```bash
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp backend/.env.example backend/.env              # preencha com os dados do Supabase
python test/test_db.py                            # testa a conexão
python admin.py                                   # cria o admin (opcional)
python app.py                                     # http://localhost:5000
```
Banco: rode `database/schema.sql` no SQL Editor do Supabase (ou compare com as tabelas existentes).

## PWA
- `frontend/manifest.json` — nome, ícones, cores, `start_url`, `display: standalone`
- `frontend/sw.js` — cache dos arquivos essenciais; navegação offline com fallback em `offline.html`; `/api/*` nunca é cacheado
- `frontend/js/pwa.js` — registra o Service Worker em todas as páginas

## Estrutura
```
app.py, admin.py
backend/   database.py, consultas.py, .env.example
database/  schema.sql
frontend/  index.html, offline.html, manifest.json, sw.js, css/, js/, pages/, icons/, images/
```

## Próximos passos
Autenticação real (JWT/sessão) nas rotas, gravar pagamentos na tabela `pagamentos`, chat, quiz, perfil e busca de psicólogos.
