// Cloudflare Worker para API do TiroEsportivo
// Conecta com banco D1 e fornece endpoints REST

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Função para lidar com CORS preflight
function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
}

// Função principal do Worker
export default {
  async fetch(request, env, ctx) {
    // Lidar com CORS preflight
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // Roteamento da API
      if (path.startsWith('/api/')) {
        return await handleAPI(request, env, path, method);
      }

      // Retornar 404 para rotas não encontradas
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders 
      });

    } catch (error) {
      console.error('Worker Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  },
};

// Função para lidar com rotas da API
async function handleAPI(request, env, path, method) {
  const segments = path.split('/').filter(Boolean);
  const resource = segments[1]; // api/[resource]
  const id = segments[2]; // api/resource/[id]

  switch (resource) {
    case 'usuarios':
      return await handleUsuarios(request, env, method, id);
    case 'competicoes':
      return await handleCompeticoes(request, env, method, id);
    case 'anuncios':
      return await handleAnuncios(request, env, method, id);
    case 'posts':
      return await handlePosts(request, env, method, id);
    case 'parceiros':
      return await handleParceiros(request, env, method, id);
    case 'resultados':
      return await handleResultados(request, env, method, id);
    default:
      return jsonResponse({ error: 'Resource not found' }, 404);
  }
}

// Handlers para cada recurso
async function handleUsuarios(request, env, method, id) {
  switch (method) {
    case 'GET':
      if (id) {
        return await getUsuario(env, id);
      } else {
        return await getUsuarios(env);
      }
    case 'POST':
      return await createUsuario(request, env);
    default:
      return jsonResponse({ error: 'Method not allowed' }, 405);
  }
}

async function handleCompeticoes(request, env, method, id) {
  switch (method) {
    case 'GET':
      if (id) {
        return await getCompeticao(env, id);
      } else {
        return await getCompeticoes(env);
      }
    default:
      return jsonResponse({ error: 'Method not allowed' }, 405);
  }
}

async function handleAnuncios(request, env, method, id) {
  switch (method) {
    case 'GET':
      return await getAnuncios(env);
    default:
      return jsonResponse({ error: 'Method not allowed' }, 405);
  }
}

async function handlePosts(request, env, method, id) {
  switch (method) {
    case 'GET':
      return await getPosts(env);
    default:
      return jsonResponse({ error: 'Method not allowed' }, 405);
  }
}

async function handleParceiros(request, env, method, id) {
  switch (method) {
    case 'GET':
      return await getParceiros(env);
    default:
      return jsonResponse({ error: 'Method not allowed' }, 405);
  }
}

async function handleResultados(request, env, method, id) {
  switch (method) {
    case 'GET':
      return await getResultados(env);
    default:
      return jsonResponse({ error: 'Method not allowed' }, 405);
  }
}

// Funções de banco de dados
async function getUsuarios(env) {
  const { results } = await env.DB.prepare(
    'SELECT id, nome, email, categoria, pontuacao_total, ranking FROM usuarios ORDER BY ranking ASC'
  ).all();
  return jsonResponse(results);
}

async function getUsuario(env, id) {
  const { results } = await env.DB.prepare(
    'SELECT id, nome, email, categoria, pontuacao_total, ranking FROM usuarios WHERE id = ?'
  ).bind(id).all();
  
  if (results.length === 0) {
    return jsonResponse({ error: 'Usuario not found' }, 404);
  }
  
  return jsonResponse(results[0]);
}

async function createUsuario(request, env) {
  const data = await request.json();
  const { nome, email, senha_hash, telefone, categoria } = data;
  
  const { success } = await env.DB.prepare(
    'INSERT INTO usuarios (nome, email, senha_hash, telefone, categoria) VALUES (?, ?, ?, ?, ?)'
  ).bind(nome, email, senha_hash, telefone, categoria || 'Iniciante').run();
  
  if (success) {
    return jsonResponse({ message: 'Usuario created successfully' }, 201);
  } else {
    return jsonResponse({ error: 'Failed to create usuario' }, 500);
  }
}

async function getCompeticoes(env) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM competicoes WHERE status = "ativa" ORDER BY data_inicio ASC'
  ).all();
  return jsonResponse(results);
}

async function getCompeticao(env, id) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM competicoes WHERE id = ?'
  ).bind(id).all();
  
  if (results.length === 0) {
    return jsonResponse({ error: 'Competicao not found' }, 404);
  }
  
  return jsonResponse(results[0]);
}

async function getAnuncios(env) {
  const { results } = await env.DB.prepare(
    'SELECT a.*, u.nome as vendedor FROM anuncios a JOIN usuarios u ON a.usuario_id = u.id WHERE a.status = "ativo" ORDER BY a.created_at DESC'
  ).all();
  return jsonResponse(results);
}

async function getPosts(env) {
  const { results } = await env.DB.prepare(
    'SELECT p.*, u.nome as autor FROM posts p JOIN usuarios u ON p.usuario_id = u.id WHERE p.status = "publicado" ORDER BY p.created_at DESC'
  ).all();
  return jsonResponse(results);
}

async function getParceiros(env) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM parceiros WHERE status = "ativo" ORDER BY nome ASC'
  ).all();
  return jsonResponse(results);
}

async function getResultados(env) {
  const { results } = await env.DB.prepare(
    'SELECT r.*, u.nome as usuario, c.nome as competicao FROM resultados r JOIN usuarios u ON r.usuario_id = u.id JOIN competicoes c ON r.competicao_id = c.id ORDER BY r.created_at DESC'
  ).all();
  return jsonResponse(results);
}

// Função utilitária para resposta JSON
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

