-- Dados iniciais para TiroEsportivo
-- Inserir dados de exemplo para desenvolvimento e testes

-- Inserir usuários de exemplo
INSERT OR IGNORE INTO usuarios (id, nome, email, senha_hash, telefone, categoria, pontuacao_total, ranking) VALUES
(1, 'João Silva', 'joao@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlG.', '11999999999', 'Atirador Experiente', 1250, 15),
(2, 'Maria Santos', 'maria@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlG.', '11888888888', 'Atirador Avançado', 1450, 8),
(3, 'Carlos Oliveira', 'carlos@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlG.', '11777777777', 'Iniciante', 650, 45),
(4, 'Ana Costa', 'ana@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlG.', '11666666666', 'Atirador Experiente', 1180, 22);

-- Inserir competições
INSERT OR IGNORE INTO competicoes (id, nome, descricao, data_inicio, data_fim, local, nivel_competicao, max_participantes, url_inscricao, imagem_url) VALUES
(1, 'Campeonato Brasileiro de Tiro Prático', 'Principal competição nacional de tiro prático do Brasil', '2024-03-15 08:00:00', '2024-03-17 18:00:00', 'São Paulo, SP', 'Nacional (Nivel 3)', 200, 'https://example.com/inscricao1', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'),
(2, 'Copa Regional de Tiro Esportivo', 'Competição regional para atiradores de todos os níveis', '2024-02-20 09:00:00', '2024-02-21 17:00:00', 'Rio de Janeiro, RJ', 'Regional (Nivel 2)', 100, 'https://example.com/inscricao2', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'),
(3, 'Torneio de Habitualidade Local', 'Torneio para desenvolvimento de habilidades básicas', '2024-02-10 08:30:00', '2024-02-10 16:00:00', 'Belo Horizonte, MG', 'Habitualidade (Nivel 1)', 50, NULL, 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop'),
(4, 'Championship de Precisão', 'Competição focada em precisão e técnica', '2024-04-05 07:00:00', '2024-04-07 19:00:00', 'Brasília, DF', 'Nacional (Nivel 3)', 150, 'https://example.com/inscricao4', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop');

-- Inserir inscrições
INSERT OR IGNORE INTO inscricoes (usuario_id, competicao_id, status) VALUES
(1, 1, 'confirmada'),
(1, 2, 'confirmada'),
(2, 1, 'confirmada'),
(2, 3, 'confirmada'),
(3, 3, 'confirmada'),
(4, 1, 'confirmada');

-- Inserir resultados
INSERT OR IGNORE INTO resultados (usuario_id, competicao_id, posicao, pontuacao, categoria) VALUES
(1, 2, 3, 485, 'Pistola 25m'),
(1, 3, 1, 492, 'Pistola 25m'),
(2, 3, 2, 488, 'Pistola 25m'),
(3, 3, 5, 445, 'Pistola 25m');

-- Inserir anúncios
INSERT OR IGNORE INTO anuncios (id, usuario_id, titulo, conteudo, preco, categoria, imagem_url, telefone, whatsapp) VALUES
(1, 1, 'Pistola Glock 17 - Seminova', 'Pistola Glock 17 em excelente estado, pouco uso. Acompanha case e documentação completa.', 2500.00, 'Armas', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop', '11999999999', '11999999999'),
(2, 2, 'Munição .40 S&W - 500 unidades', 'Munição .40 S&W de alta qualidade, ideal para treinamento e competições.', 800.00, 'Munição', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', '11888888888', '11888888888'),
(3, 3, 'Colete Balístico Nível IIIA', 'Colete balístico profissional, certificado, tamanho M. Perfeito estado de conservação.', 1200.00, 'Equipamentos', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', '11777777777', '11777777777'),
(4, 4, 'Óculos de Proteção Oakley', 'Óculos de proteção balística Oakley, modelo M Frame. Lentes intercambiáveis incluídas.', 350.00, 'Acessórios', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop', '11666666666', '11666666666');

-- Inserir posts/notícias
INSERT OR IGNORE INTO posts (id, usuario_id, titulo, conteudo, imagem_url, tipo, likes) VALUES
(1, 1, 'Novas Regras para Competições 2024', 'A Confederação Brasileira de Tiro Esportivo anunciou as novas regras que entrarão em vigor em 2024. As principais mudanças incluem novos critérios de pontuação e categorias de competição.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 'noticia', 15),
(2, 2, 'Brasil Conquista Medalha de Ouro no Mundial', 'O atirador brasileiro João Silva conquistou a medalha de ouro na categoria pistola 25m no Campeonato Mundial de Tiro Esportivo, realizado na Alemanha.', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'resultado', 23),
(3, 3, 'Curso de Segurança em Tiro Esportivo', 'Inscrições abertas para o curso de segurança em tiro esportivo. O curso aborda procedimentos de segurança, manuseio correto de armas e primeiros socorros.', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop', 'dica', 12);

-- Inserir comentários
INSERT OR IGNORE INTO comentarios (post_id, usuario_id, conteudo) VALUES
(1, 2, 'Muito importante essas mudanças! Vai melhorar muito o nível das competições.'),
(1, 3, 'Concordo, estava na hora de atualizar as regras.'),
(2, 1, 'Parabéns ao João! Orgulho do Brasil!'),
(2, 4, 'Que conquista incrível! Inspirador para todos nós.'),
(3, 1, 'Curso muito importante, principalmente para iniciantes.'),
(3, 2, 'Já me inscrevi! Recomendo para todos.');

-- Inserir parceiros
INSERT OR IGNORE INTO parceiros (id, nome, descricao, logo_url, website_url, email, telefone) VALUES
(1, 'Taurus Armas', 'Fabricante nacional de armas de fogo e acessórios para tiro esportivo.', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop', 'https://example.com/taurus', 'contato@taurus.com.br', '11999999999'),
(2, 'CBC Munições', 'Líder em munições esportivas e de defesa no Brasil.', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop', 'https://example.com/cbc', 'vendas@cbc.com.br', '11888888888'),
(3, 'Magtech Ammunition', 'Munições de alta qualidade para competições e treinamento.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 'https://example.com/magtech', 'info@magtech.com.br', '11777777777'),
(4, 'Clube de Tiro Águia', 'Clube especializado em tiro esportivo e treinamento profissional.', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=100&h=100&fit=crop', 'https://example.com/aguia', 'contato@aguia.com.br', '11666666666');

-- Inserir sessões de treinamento
INSERT OR IGNORE INTO sessoes_treinamento (usuario_id, data_sessao, local, modalidade, pontuacao, tiros_disparados, observacoes) VALUES
(1, '2024-01-20 14:00:00', 'Clube de Tiro São Paulo', 'Pistola 25m', 485, 50, 'Boa sessão, melhorou a precisão'),
(1, '2024-01-18 16:00:00', 'Clube de Tiro São Paulo', 'Pistola 25m', 492, 50, 'Excelente desempenho'),
(2, '2024-01-19 10:00:00', 'Clube de Tiro Rio', 'Pistola 25m', 488, 50, 'Consistência boa'),
(3, '2024-01-17 15:00:00', 'Clube de Tiro BH', 'Pistola 25m', 445, 50, 'Precisa melhorar a postura');

