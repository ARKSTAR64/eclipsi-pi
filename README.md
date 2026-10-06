# EcliPsi

> Appointment scheduling between patients and professionals (patient, doctor/psychologist). Focused on simple and accessible navigation.

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE) 

[![Senac](https://img.shields.io/badge/Institution-Senac%20College-blue)](https://www.senac.br/) 

[![LGPD](https://img.shields.io/badge/Compliance-LGPD%20Ready-blueviolet)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) 

## LGPD & Data Privacy Compliance

Because this application processes **Sensitive Personal Data** (*dados pessoais sensíveis*), privacy by design was a core requirement of this project in compliance with Brazilian Federal Law nº 13.709/2018 (LGPD).

## Tech Stack 

* **Frontend:** Html, css and javascript

* **Backend:** Python

* **Database:** Supabase

* **Testing:** Render

## Getting Started (Local Development)
Follow these steps to run the project environment locally. 

### 1. Prerequisites 

Ensure you have installed: 

* [Git](https://git-scm.com) 
* [Flask](https://flask.palletsprojects.com/en/stable/)

## Setup and Execution

```bash
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp backend/.env.example backend/.env              # Fill in the Supabase details.
python test/test_db.py                            # tests the connection.
python admin.py                                   # creates the admin (optional).
python app.py                                     # http://localhost:5000
```

## PWA
- `frontend/manifest.json` — name, icon, colors, `start_url`, `display: standalone`
- `frontend/sw.js` — Caching of essential files; offline browsing with fallback in `offline.html`; `/api/*` It is never curly.
- `frontend/js/pwa.js` — registers the Service Worker on all pages

## Estrutura
```
app.py, admin.py
backend/   database.py, consultas.py, .env.example
database/  schema.sql
frontend/  index.html, offline.html, manifest.json, sw.js, css/, js/, pages/, icons/, images/
```


## Future Improvements

* Chat
* Payment system
* Mobile app

## Authors & Project Team

* Maria Sophia de Lima dos Santos - [GitHub](https://github.com/Yuki1XD)
* Gabriel Felipe Belo de Moura - [GitHub](https://github.com/RazebaG)
* Erik Melado Carvalho - [GitHub](https://github.com/ARKSTAR64)
* Luís Filipe Harten Nogueira - [GitHub](https://github.com/luisfhartenn)
* Júlia Parra Torres - [GitHub](https://github.com/juliispts)
* João Vitor Lima B. G. de Melo - [GitHub](https://github.com/JoaoVitorMeloDev)
* Valentina Matias de Oliveira dos Santos - [GitHub]()

* Academic Advisor / Professor: Prof. Ícaro Santos Ferreira








