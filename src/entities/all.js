// Mock data e entidades para a aplicação TiroEsportivo

// Mock data para anúncios
const mockAnuncios = [
  {
    id: 1,
    titulo: "Pistola Glock 17 - Seminova",
    conteudo: "Pistola Glock 17 em excelente estado, pouco uso. Acompanha case e documentação completa.",
    imagem_url: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop",
    whatsapp: "11999999999",
    telefone: "11999999999",
    created_date: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    titulo: "Munição .40 S&W - 500 unidades",
    conteudo: "Munição .40 S&W de alta qualidade, ideal para treinamento e competições.",
    imagem_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    whatsapp: "11888888888",
    telefone: "11888888888",
    created_date: "2024-01-14T15:30:00Z"
  },
  {
    id: 3,
    titulo: "Colete Balístico Nível IIIA",
    conteudo: "Colete balístico profissional, certificado, tamanho M. Perfeito estado de conservação.",
    imagem_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    whatsapp: "11777777777",
    telefone: "11777777777",
    created_date: "2024-01-13T09:15:00Z"
  },
  {
    id: 4,
    titulo: "Óculos de Proteção Oakley",
    conteudo: "Óculos de proteção balística Oakley, modelo M Frame. Lentes intercambiáveis incluídas.",
    imagem_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
    whatsapp: "11666666666",
    telefone: "11666666666",
    created_date: "2024-01-12T14:45:00Z"
  }
];

// Mock data para competições
const mockCompeticoes = [
  {
    id: 1,
    nome: "Campeonato Brasileiro de Tiro Prático",
    data_inicio: "2024-03-15T08:00:00Z",
    data_fim: "2024-03-17T18:00:00Z",
    local: "São Paulo, SP",
    nivel_competicao: "Nacional (Nivel 3)",
    imagem_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    url_inscricao: "https://example.com/inscricao1",
    created_date: "2024-01-10T10:00:00Z"
  },
  {
    id: 2,
    nome: "Copa Regional de Tiro Esportivo",
    data_inicio: "2024-02-20T09:00:00Z",
    data_fim: "2024-02-21T17:00:00Z",
    local: "Rio de Janeiro, RJ",
    nivel_competicao: "Regional (Nivel 2)",
    imagem_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    url_inscricao: "https://example.com/inscricao2",
    created_date: "2024-01-09T11:30:00Z"
  },
  {
    id: 3,
    nome: "Torneio de Habitualidade Local",
    data_inicio: "2024-02-10T08:30:00Z",
    data_fim: "2024-02-10T16:00:00Z",
    local: "Belo Horizonte, MG",
    nivel_competicao: "Habitualidade (Nivel 1)",
    imagem_url: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop",
    url_inscricao: null,
    created_date: "2024-01-08T16:20:00Z"
  },
  {
    id: 4,
    nome: "Championship de Precisão",
    data_inicio: "2024-04-05T07:00:00Z",
    data_fim: "2024-04-07T19:00:00Z",
    local: "Brasília, DF",
    nivel_competicao: "Nacional (Nivel 3)",
    imagem_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
    url_inscricao: "https://example.com/inscricao4",
    created_date: "2024-01-07T13:10:00Z"
  }
];

// Mock data para parceiros
const mockParceiros = [
  {
    id: 1,
    nome: "Taurus Armas",
    descricao: "Fabricante nacional de armas de fogo e acessórios para tiro esportivo.",
    logo_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    website_url: "https://example.com/taurus",
    created_date: "2024-01-05T10:00:00Z"
  },
  {
    id: 2,
    nome: "CBC Munições",
    descricao: "Líder em munições esportivas e de defesa no Brasil.",
    logo_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
    website_url: "https://example.com/cbc",
    created_date: "2024-01-04T14:30:00Z"
  },
  {
    id: 3,
    nome: "Magtech Ammunition",
    descricao: "Munições de alta qualidade para competições e treinamento.",
    logo_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
    website_url: "https://example.com/magtech",
    created_date: "2024-01-03T09:45:00Z"
  },
  {
    id: 4,
    nome: "Clube de Tiro Águia",
    descricao: "Clube especializado em tiro esportivo e treinamento profissional.",
    logo_url: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=100&h=100&fit=crop",
    website_url: "https://example.com/aguia",
    created_date: "2024-01-02T16:15:00Z"
  }
];

// Mock data para posts/notícias
const mockPosts = [
  {
    id: 1,
    titulo: "Novas Regras para Competições 2024",
    conteudo: "A Confederação Brasileira de Tiro Esportivo anunciou as novas regras que entrarão em vigor em 2024. As principais mudanças incluem novos critérios de pontuação e categorias de competição.",
    imagem_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    created_date: "2024-01-20T12:00:00Z"
  },
  {
    id: 2,
    titulo: "Brasil Conquista Medalha de Ouro no Mundial",
    conteudo: "O atirador brasileiro João Silva conquistou a medalha de ouro na categoria pistola 25m no Campeonato Mundial de Tiro Esportivo, realizado na Alemanha.",
    imagem_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    created_date: "2024-01-18T08:30:00Z"
  },
  {
    id: 3,
    titulo: "Curso de Segurança em Tiro Esportivo",
    conteudo: "Inscrições abertas para o curso de segurança em tiro esportivo. O curso aborda procedimentos de segurança, manuseio correto de armas e primeiros socorros.",
    imagem_url: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop",
    created_date: "2024-01-16T15:45:00Z"
  }
];

// Classe base para entidades
class BaseEntity {
  constructor(data) {
    Object.assign(this, data);
  }

  static async list(orderBy = "-created_date", limit = null) {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let data = [...this.mockData];
    
    // Ordenação simples
    if (orderBy.startsWith('-')) {
      const field = orderBy.substring(1);
      data.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    } else {
      data.sort((a, b) => new Date(a[orderBy]) - new Date(b[orderBy]));
    }
    
    // Limite
    if (limit) {
      data = data.slice(0, limit);
    }
    
    return data.map(item => new this(item));
  }

  static async get(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const item = this.mockData.find(item => item.id === id);
    return item ? new this(item) : null;
  }
}

// Entidade Anuncio
export class Anuncio extends BaseEntity {
  static mockData = mockAnuncios;
}

// Entidade Competicao
export class Competicao extends BaseEntity {
  static mockData = mockCompeticoes;
}

// Entidade Parceiro
export class Parceiro extends BaseEntity {
  static mockData = mockParceiros;
}

// Entidade Post
export class Post extends BaseEntity {
  static mockData = mockPosts;
}

// Mock data para acervo
const mockAcervo = [
  {
    id: 1,
    equipamento: "Pistola Glock 17",
    calibre: "9mm",
    numero_serie: "ABC123456",
    fabricante: "Glock",
    modelo: "17 Gen5",
    status: "ativo",
    created_date: "2024-01-10T10:00:00Z"
  },
  {
    id: 2,
    equipamento: "Revolver Taurus 85",
    calibre: ".38",
    numero_serie: "DEF789012",
    fabricante: "Taurus",
    modelo: "85",
    status: "ativo",
    created_date: "2024-01-08T14:30:00Z"
  },
  {
    id: 3,
    equipamento: "Pistola Springfield XD",
    calibre: ".40",
    numero_serie: "GHI345678",
    fabricante: "Springfield",
    modelo: "XD-40",
    status: "ativo",
    created_date: "2024-01-05T09:15:00Z"
  },
  {
    id: 4,
    equipamento: "Carabina CBC 8022",
    calibre: ".22",
    numero_serie: "JKL901234",
    fabricante: "CBC",
    modelo: "8022",
    status: "ativo",
    created_date: "2024-01-03T16:45:00Z"
  }
];

// Mock data para habitualidades
const mockHabitalidades = [
  // Treinamentos
  {
    id: 1,
    data: "2024-01-20T14:00:00Z",
    equipamento: "Pistola Glock 17",
    calibre: "9mm",
    clube: "Clube de Tiro São Paulo",
    divisao: "Production",
    numero_tiros: 50,
    observacoes: "Treino de precisão",
    created_date: "2024-01-20T14:00:00Z"
  },
  {
    id: 2,
    data: "2024-01-18T16:00:00Z",
    equipamento: "Pistola Glock 17",
    calibre: "9mm",
    clube: "Clube de Tiro São Paulo",
    divisao: "Production",
    numero_tiros: 50,
    observacoes: "Treino de velocidade",
    created_date: "2024-01-18T16:00:00Z"
  },
  {
    id: 3,
    data: "2024-01-15T10:00:00Z",
    equipamento: "Revolver Taurus 85",
    calibre: ".38",
    clube: "Clube de Tiro Rio",
    divisao: "Revolver",
    numero_tiros: 30,
    observacoes: "Treino básico",
    created_date: "2024-01-15T10:00:00Z"
  },
  // Competições (habitualidades com nome_competicao)
  {
    id: 4,
    data: "2024-01-25T08:00:00Z",
    equipamento: "Pistola Glock 17",
    calibre: "9mm",
    nome_competicao: "Campeonato Regional SP",
    etapa: "1ª Etapa",
    divisao: "Production",
    clube: "Clube de Tiro São Paulo",
    observacoes: "Competição oficial",
    created_date: "2024-01-25T08:00:00Z"
  },
  {
    id: 5,
    data: "2024-01-22T09:00:00Z",
    equipamento: "Pistola Springfield XD",
    calibre: ".40",
    nome_competicao: "Copa Local",
    etapa: "Única",
    divisao: "Limited",
    clube: "Clube de Tiro BH",
    observacoes: "Primeira competição com .40",
    created_date: "2024-01-22T09:00:00Z"
  },
  {
    id: 6,
    data: "2024-01-12T15:00:00Z",
    equipamento: "Pistola Glock 17",
    calibre: "9mm",
    clube: "Clube de Tiro São Paulo",
    divisao: "Production",
    numero_tiros: 40,
    observacoes: "Treino de transições",
    created_date: "2024-01-12T15:00:00Z"
  },
  {
    id: 7,
    data: "2024-01-10T11:00:00Z",
    equipamento: "Revolver Taurus 85",
    calibre: ".38",
    nome_competicao: "Torneio de Revolver",
    etapa: "Classificatória",
    divisao: "Revolver",
    clube: "Clube de Tiro Rio",
    observacoes: "Boa performance",
    created_date: "2024-01-10T11:00:00Z"
  },
  {
    id: 8,
    data: "2024-01-08T13:30:00Z",
    equipamento: "Carabina CBC 8022",
    calibre: ".22",
    clube: "Clube de Tiro BH",
    divisao: "Rifle",
    numero_tiros: 60,
    observacoes: "Treino de precisão com carabina",
    created_date: "2024-01-08T13:30:00Z"
  },
  {
    id: 9,
    data: "2024-01-05T14:00:00Z",
    equipamento: "Pistola Springfield XD",
    calibre: ".40",
    clube: "Clube de Tiro BH",
    divisao: "Limited",
    numero_tiros: 45,
    observacoes: "Adaptação ao novo equipamento",
    created_date: "2024-01-05T14:00:00Z"
  },
  {
    id: 10,
    data: "2024-01-03T16:00:00Z",
    equipamento: "Pistola Glock 17",
    calibre: "9mm",
    nome_competicao: "Copa de Verão",
    etapa: "Final",
    divisao: "Production",
    clube: "Clube de Tiro São Paulo",
    observacoes: "Excelente resultado",
    created_date: "2024-01-03T16:00:00Z"
  }
];

// Entidade Acervo
export class Acervo extends BaseEntity {
  static mockData = mockAcervo;
}

// Entidade Habitualidade
export class Habitualidade extends BaseEntity {
  static mockData = mockHabitalidades;
}

// Exportações nomeadas para compatibilidade
export { Anuncio as default };

