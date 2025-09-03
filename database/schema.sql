-- Schema para banco de dados TiroEsportivo
-- Compatível com Cloudflare D1 (SQLite)

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    telefone TEXT,
    categoria TEXT DEFAULT 'Iniciante',
    pontuacao_total INTEGER DEFAULT 0,
    ranking INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de competições
CREATE TABLE IF NOT EXISTS competicoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    local TEXT NOT NULL,
    nivel_competicao TEXT NOT NULL CHECK (nivel_competicao IN ('Habitualidade (Nivel 1)', 'Regional (Nivel 2)', 'Nacional (Nivel 3)')),
    max_participantes INTEGER,
    taxa_inscricao DECIMAL(10,2) DEFAULT 0.00,
    url_inscricao TEXT,
    imagem_url TEXT,
    status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'encerrada', 'cancelada')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de inscrições em competições
CREATE TABLE IF NOT EXISTS inscricoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    competicao_id INTEGER NOT NULL,
    data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'confirmada' CHECK (status IN ('pendente', 'confirmada', 'cancelada')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (competicao_id) REFERENCES competicoes(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, competicao_id)
);

-- Tabela de resultados
CREATE TABLE IF NOT EXISTS resultados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    competicao_id INTEGER NOT NULL,
    posicao INTEGER,
    pontuacao INTEGER NOT NULL,
    categoria TEXT NOT NULL,
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (competicao_id) REFERENCES competicoes(id) ON DELETE CASCADE
);

-- Tabela de anúncios/classificados
CREATE TABLE IF NOT EXISTS anuncios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    preco DECIMAL(10,2),
    categoria TEXT NOT NULL,
    imagem_url TEXT,
    telefone TEXT,
    whatsapp TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'vendido', 'inativo')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de posts/notícias
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    imagem_url TEXT,
    tipo TEXT DEFAULT 'noticia' CHECK (tipo IN ('noticia', 'dica', 'resultado', 'geral')),
    status TEXT DEFAULT 'publicado' CHECK (status IN ('rascunho', 'publicado', 'arquivado')),
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de comentários
CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    conteudo TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de parceiros
CREATE TABLE IF NOT EXISTS parceiros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    logo_url TEXT,
    website_url TEXT,
    email TEXT,
    telefone TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sessões de treinamento
CREATE TABLE IF NOT EXISTS sessoes_treinamento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    data_sessao DATETIME NOT NULL,
    local TEXT,
    modalidade TEXT NOT NULL,
    pontuacao INTEGER,
    tiros_disparados INTEGER,
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_competicoes_data ON competicoes(data_inicio);
CREATE INDEX IF NOT EXISTS idx_resultados_usuario ON resultados(usuario_id);
CREATE INDEX IF NOT EXISTS idx_resultados_competicao ON resultados(competicao_id);
CREATE INDEX IF NOT EXISTS idx_anuncios_status ON anuncios(status);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_inscricoes_usuario ON inscricoes(usuario_id);

-- Triggers para atualizar updated_at
CREATE TRIGGER IF NOT EXISTS update_usuarios_updated_at 
    AFTER UPDATE ON usuarios
    BEGIN
        UPDATE usuarios SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_competicoes_updated_at 
    AFTER UPDATE ON competicoes
    BEGIN
        UPDATE competicoes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_anuncios_updated_at 
    AFTER UPDATE ON anuncios
    BEGIN
        UPDATE anuncios SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_posts_updated_at 
    AFTER UPDATE ON posts
    BEGIN
        UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

