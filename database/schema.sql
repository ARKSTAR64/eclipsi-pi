-- Schema inferido do código (app.py / consultas.py). Confira contra o Supabase antes de rodar.
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(100) NOT NULL,
  email         VARCHAR(254) NOT NULL UNIQUE,
  senha         TEXT NOT NULL,
  telefone      VARCHAR(11),
  role          VARCHAR(10) NOT NULL CHECK (role IN ('paciente','medico','admin')),
  idade         INTEGER CHECK (idade IS NULL OR idade BETWEEN 0 AND 120),
  genero        VARCHAR(30),
  especialidade VARCHAR(30),
  registro      VARCHAR(20) UNIQUE,
  uf            CHAR(2),
  descricao     VARCHAR(500),
  valor_hora    NUMERIC(10,2),
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS consultas (
  id          SERIAL PRIMARY KEY,
  paciente_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medico_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_hora   TIMESTAMPTZ NOT NULL,
  valor       NUMERIC(10,2) NOT NULL DEFAULT 0,
  status      VARCHAR(10) NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada','realizada','cancelada')),
  anotacoes   TEXT,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- impede dois agendamentos ativos no mesmo horário do mesmo médico
CREATE UNIQUE INDEX IF NOT EXISTS ux_consulta_horario
  ON consultas (medico_id, data_hora) WHERE status <> 'cancelada';

CREATE TABLE IF NOT EXISTS avaliacoes (
  id          SERIAL PRIMARY KEY,
  consulta_id INTEGER NOT NULL UNIQUE REFERENCES consultas(id) ON DELETE CASCADE,
  medico_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  paciente_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nota        SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario  VARCHAR(500),
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pagamentos (
  id              SERIAL PRIMARY KEY,
  consulta_id     INTEGER REFERENCES consultas(id) ON DELETE SET NULL,
  valor           NUMERIC(10,2) NOT NULL,
  taxa_plataforma NUMERIC(10,2) NOT NULL DEFAULT 0,
  repasse         NUMERIC(10,2) NOT NULL DEFAULT 0,
  status          VARCHAR(10) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','pago','falhou')),
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_consultas_paciente ON consultas(paciente_id);
CREATE INDEX IF NOT EXISTS ix_consultas_medico   ON consultas(medico_id);
