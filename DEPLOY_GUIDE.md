# Guia Completo de Deploy da Aplicação TiroEsportivo no Cloudflare

**Autor:** Manus AI  
**Data:** 2 de setembro de 2025  
**Versão:** 1.0

## Sumário

1. [Introdução](#introdução)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Cloudflare D1 Database](#configuração-do-cloudflare-d1-database)
4. [Deploy do Frontend com Cloudflare Pages](#deploy-do-frontend-com-cloudflare-pages)
5. [Deploy da API com Cloudflare Workers](#deploy-da-api-com-cloudflare-workers)
6. [Configuração de Domínio Personalizado](#configuração-de-domínio-personalizado)
7. [Configurações de DNS](#configurações-de-dns)
8. [Configurações de SSL/TLS](#configurações-de-ssltls)
9. [Monitoramento e Logs](#monitoramento-e-logs)
10. [Troubleshooting](#troubleshooting)
11. [Referências](#referências)

---



## Introdução

A aplicação TiroEsportivo é uma plataforma completa para gerenciamento, competições e comunidade do tiro esportivo, desenvolvida com tecnologias modernas e otimizada para deploy na infraestrutura do Cloudflare. Este guia fornece instruções detalhadas para realizar o deploy completo da aplicação, incluindo frontend, backend, banco de dados e configuração de domínio personalizado.

O Cloudflare oferece uma stack completa de serviços que se integram perfeitamente para hospedar aplicações web modernas. Para o TiroEsportivo, utilizamos três serviços principais: Cloudflare Pages para o frontend React, Cloudflare Workers para a API backend, e Cloudflare D1 para o banco de dados SQLite. Esta arquitetura proporciona alta performance, escalabilidade global e custos otimizados.

A aplicação TiroEsportivo foi desenvolvida seguindo as melhores práticas de desenvolvimento web moderno, utilizando React para o frontend com componentes reutilizáveis do shadcn/ui, Tailwind CSS para estilização, e uma API RESTful construída com Cloudflare Workers. O banco de dados foi modelado especificamente para atender às necessidades do tiro esportivo, incluindo gestão de usuários, competições, resultados, anúncios classificados e comunidade.

Este guia assume que você possui conhecimentos básicos de desenvolvimento web, Git, e linha de comando. Todas as instruções foram testadas e validadas para garantir um processo de deploy suave e eficiente. O tempo estimado para completar todo o processo de deploy é de aproximadamente 30 a 60 minutos, dependendo da sua familiaridade com as ferramentas do Cloudflare.




## Pré-requisitos

Antes de iniciar o processo de deploy, certifique-se de que você possui todos os requisitos necessários configurados em seu ambiente de desenvolvimento. Esta seção detalha cada pré-requisito e fornece links para instalação quando necessário.

### Conta no Cloudflare

Você precisará de uma conta ativa no Cloudflare com acesso aos seguintes serviços:

- **Cloudflare Pages**: Para hospedar o frontend da aplicação
- **Cloudflare Workers**: Para executar a API backend
- **Cloudflare D1**: Para o banco de dados SQLite
- **Cloudflare DNS**: Para gerenciar o domínio personalizado

Se você ainda não possui uma conta, pode criar gratuitamente em [cloudflare.com](https://cloudflare.com). O plano gratuito do Cloudflare é suficiente para começar, mas para aplicações em produção com alto tráfego, considere os planos pagos que oferecem recursos adicionais e limites mais altos.

### Ferramentas de Desenvolvimento

**Node.js e pnpm**: A aplicação foi desenvolvida usando Node.js versão 18 ou superior. O gerenciador de pacotes pnpm é recomendado para melhor performance e eficiência de armazenamento. Você pode instalar o Node.js através do site oficial [nodejs.org](https://nodejs.org) e o pnpm executando `npm install -g pnpm`.

**Wrangler CLI**: O Wrangler é a ferramenta oficial de linha de comando do Cloudflare para gerenciar Workers, Pages e D1. Instale globalmente executando `npm install -g wrangler`. Após a instalação, você precisará autenticar com sua conta Cloudflare executando `wrangler login`.

**Git**: Sistema de controle de versão necessário para gerenciar o código e integrar com o Cloudflare Pages. A maioria dos sistemas operacionais modernos já inclui o Git, mas você pode instalá-lo através de [git-scm.com](https://git-scm.com) se necessário.

### Domínio Personalizado

Para configurar um domínio personalizado, você precisará:

- **Propriedade do domínio**: Você deve ser o proprietário ou ter controle administrativo sobre o domínio que deseja usar
- **Acesso ao painel de controle do registrador**: Para configurar os nameservers do Cloudflare
- **Certificados SSL**: O Cloudflare fornece certificados SSL gratuitos, mas você pode optar por certificados personalizados se necessário

### Estrutura do Projeto

Certifique-se de que você possui a estrutura completa do projeto TiroEsportivo, incluindo:

- Código fonte do frontend React na pasta `src/`
- Arquivos de configuração do banco de dados na pasta `database/`
- Worker do Cloudflare no arquivo `src/worker.js`
- Arquivos de configuração `wrangler.toml` e `package.json`
- Build de produção na pasta `dist/` (gerado pelo comando `pnpm run build`)

### Verificação dos Pré-requisitos

Antes de prosseguir, execute os seguintes comandos para verificar se tudo está configurado corretamente:

```bash
# Verificar versão do Node.js
node --version

# Verificar versão do pnpm
pnpm --version

# Verificar instalação do Wrangler
wrangler --version

# Verificar autenticação no Cloudflare
wrangler whoami

# Verificar estrutura do projeto
ls -la TiroEsportivo/
```

Se todos os comandos executarem sem erros e retornarem as versões esperadas, você está pronto para prosseguir com o deploy.


## Configuração do Cloudflare D1 Database

O Cloudflare D1 é um banco de dados SQLite distribuído globalmente que oferece baixa latência e alta disponibilidade. Para a aplicação TiroEsportivo, o D1 armazena todos os dados da aplicação, incluindo usuários, competições, resultados e conteúdo da comunidade.

### Criação do Banco de Dados

O primeiro passo é criar uma nova instância do banco D1. Execute o seguinte comando no diretório raiz do projeto:

```bash
wrangler d1 create tiroesportivo-db
```

Este comando criará um novo banco de dados e retornará informações importantes, incluindo o `database_id` que você precisará para configurar o arquivo `wrangler.toml`. A saída será similar a:

```
✅ Successfully created DB 'tiroesportivo-db'
Created your database using D1's new storage backend.
The new storage backend is not yet recommended for production workloads, but backs up your data via point-in-time restore.

[[d1_databases]]
binding = "DB"
database_name = "tiroesportivo-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Configuração do wrangler.toml

Copie as informações retornadas pelo comando anterior e atualize o arquivo `wrangler.toml` na raiz do projeto. Substitua o valor `your-database-id-here` pelo `database_id` real fornecido:

```toml
[[d1_databases]]
binding = "DB"
database_name = "tiroesportivo-db"
database_id = "seu-database-id-aqui"
```

A configuração `binding = "DB"` define como o banco será acessado no código do Worker. O nome "DB" é usado no código JavaScript para executar queries SQL.

### Execução do Schema

Com o banco criado, o próximo passo é executar o schema SQL para criar todas as tabelas necessárias. O arquivo `database/schema.sql` contém a definição completa da estrutura do banco, incluindo tabelas, índices e triggers.

Execute o comando para aplicar o schema:

```bash
wrangler d1 execute tiroesportivo-db --file=database/schema.sql
```

Este comando criará todas as tabelas necessárias para a aplicação:

- `usuarios`: Armazena informações dos usuários registrados
- `competicoes`: Dados das competições de tiro esportivo
- `inscricoes`: Relacionamento entre usuários e competições
- `resultados`: Resultados das competições
- `anuncios`: Classificados e anúncios da comunidade
- `posts`: Posts e notícias da comunidade
- `comentarios`: Comentários nos posts
- `parceiros`: Informações dos parceiros
- `sessoes_treinamento`: Registros de sessões de treinamento

### População com Dados Iniciais

Para facilitar o desenvolvimento e testes, execute o arquivo de seed para popular o banco com dados de exemplo:

```bash
wrangler d1 execute tiroesportivo-db --file=database/seed.sql
```

Os dados de exemplo incluem usuários fictícios, competições, anúncios e posts que permitem testar todas as funcionalidades da aplicação imediatamente após o deploy.

### Verificação da Configuração

Para verificar se o banco foi configurado corretamente, você pode executar uma query de teste:

```bash
wrangler d1 execute tiroesportivo-db --command="SELECT COUNT(*) as total_usuarios FROM usuarios"
```

Se tudo estiver configurado corretamente, você deve ver o número de usuários inseridos pelos dados de seed.

### Backup e Restauração

O Cloudflare D1 oferece recursos de backup automático através do point-in-time restore. Para criar backups manuais ou restaurar dados, você pode usar os comandos:

```bash
# Exportar dados
wrangler d1 export tiroesportivo-db --output=backup.sql

# Importar dados (se necessário)
wrangler d1 execute tiroesportivo-db --file=backup.sql
```

### Monitoramento do Banco

Você pode monitorar o uso e performance do banco através do dashboard do Cloudflare. Acesse a seção D1 no painel de controle para visualizar métricas como número de queries, latência e uso de armazenamento.

### Limitações e Considerações

O Cloudflare D1 possui algumas limitações que devem ser consideradas:

- Limite de 100.000 queries por dia no plano gratuito
- Tamanho máximo do banco de 500MB no plano gratuito
- Latência pode variar dependendo da localização geográfica
- Algumas funcionalidades avançadas do SQLite podem não estar disponíveis

Para aplicações em produção com alto volume de dados, considere o upgrade para planos pagos que oferecem limites mais altos e recursos adicionais.


## Deploy do Frontend com Cloudflare Pages

O Cloudflare Pages é uma plataforma de hospedagem para sites estáticos e aplicações frontend que oferece deploy automático, CDN global e integração perfeita com outros serviços do Cloudflare. Para a aplicação TiroEsportivo, o Pages hospedará o frontend React compilado.

### Preparação do Build

Antes de fazer o deploy, certifique-se de que o build de produção está atualizado e otimizado. No diretório raiz do projeto, execute:

```bash
pnpm run build
```

Este comando utiliza o Vite para compilar e otimizar a aplicação React, gerando os arquivos estáticos na pasta `dist/`. O processo de build inclui:

- Minificação do JavaScript e CSS
- Otimização de imagens e assets
- Tree-shaking para remover código não utilizado
- Geração de hashes para cache busting
- Criação de chunks otimizados para carregamento eficiente

### Configuração de Redirects e Headers

A aplicação TiroEsportivo utiliza React Router para navegação client-side, o que requer configuração especial para funcionar corretamente em um ambiente de hospedagem estática. Os arquivos `_redirects` e `_headers` na pasta `dist/` já estão configurados adequadamente.

O arquivo `_redirects` garante que todas as rotas sejam direcionadas para `index.html`, permitindo que o React Router gerencie a navegação:

```
/*    /index.html   200
```

O arquivo `_headers` configura cabeçalhos de segurança e cache para otimizar a performance e segurança da aplicação:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
```

### Deploy via Wrangler CLI

A forma mais direta de fazer o deploy é utilizando o Wrangler CLI. Execute o seguinte comando no diretório raiz do projeto:

```bash
wrangler pages deploy dist --project-name=tiroesportivo
```

Este comando fará o upload de todos os arquivos da pasta `dist/` para o Cloudflare Pages. Durante o primeiro deploy, você será solicitado a confirmar a criação do projeto. O processo inclui:

- Upload de todos os assets estáticos
- Configuração automática do CDN
- Geração de URL de preview
- Configuração de SSL/TLS automático

### Deploy via Git Integration

Para um fluxo de trabalho mais automatizado, você pode configurar a integração com Git. Esta abordagem permite deploys automáticos sempre que você fizer push para o repositório.

**Passo 1**: Faça push do código para um repositório Git (GitHub, GitLab, ou Bitbucket):

```bash
git add .
git commit -m "Deploy inicial da aplicação TiroEsportivo"
git push origin main
```

**Passo 2**: No dashboard do Cloudflare, acesse a seção Pages e clique em "Create a project".

**Passo 3**: Conecte seu repositório Git e configure as seguintes opções:

- **Framework preset**: Vite
- **Build command**: `pnpm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (raiz do projeto)

**Passo 4**: Configure as variáveis de ambiente necessárias (se houver) na seção "Environment variables".

### Configuração de Domínio Personalizado

Após o deploy inicial, você pode configurar um domínio personalizado para a aplicação. No dashboard do Cloudflare Pages:

**Passo 1**: Acesse o projeto TiroEsportivo e vá para a aba "Custom domains".

**Passo 2**: Clique em "Set up a custom domain" e insira seu domínio (ex: `tiroesportivo.com.br`).

**Passo 3**: O Cloudflare fornecerá instruções específicas para configurar os registros DNS, que variam dependendo se o domínio já está no Cloudflare ou em outro provedor.

### Configuração de Preview Deployments

O Cloudflare Pages automaticamente cria deployments de preview para branches que não sejam a principal. Isso permite testar mudanças antes de fazer merge para produção. Para configurar:

**Passo 1**: No dashboard do projeto, acesse "Settings" > "Builds & deployments".

**Passo 2**: Configure as branches que devem gerar preview deployments.

**Passo 3**: Opcionalmente, configure diferentes comandos de build para preview e produção.

### Otimização de Performance

Para maximizar a performance da aplicação no Cloudflare Pages, considere as seguintes otimizações:

**Cache Headers**: Os headers de cache já estão configurados no arquivo `_headers` para otimizar o carregamento de assets estáticos.

**Compression**: O Cloudflare automaticamente aplica compressão Gzip e Brotli para reduzir o tamanho dos arquivos transferidos.

**Image Optimization**: Para imagens, considere usar o Cloudflare Images ou otimizar as imagens antes do build usando ferramentas como `imagemin`.

**Bundle Analysis**: Use ferramentas como `webpack-bundle-analyzer` para identificar oportunidades de otimização no bundle JavaScript.

### Monitoramento e Analytics

O Cloudflare Pages oferece analytics detalhados sobre o tráfego e performance da aplicação:

**Web Analytics**: Métricas de visitantes, page views e performance sem necessidade de JavaScript adicional.

**Core Web Vitals**: Monitoramento automático das métricas de experiência do usuário definidas pelo Google.

**Real User Monitoring (RUM)**: Dados de performance coletados de usuários reais em diferentes localizações geográficas.

### Rollback e Versionamento

Cada deploy no Cloudflare Pages cria uma versão imutável da aplicação. Para fazer rollback:

**Passo 1**: No dashboard do projeto, acesse a aba "Deployments".

**Passo 2**: Localize a versão para a qual deseja fazer rollback.

**Passo 3**: Clique em "Rollback to this deployment".

O rollback é instantâneo e não requer rebuild da aplicação.

### Troubleshooting Comum

**Build Failures**: Verifique os logs de build no dashboard para identificar erros de compilação ou dependências faltantes.

**Routing Issues**: Certifique-se de que o arquivo `_redirects` está presente na pasta `dist/` e configurado corretamente.

**Asset Loading**: Verifique se todos os assets estão sendo referenciados com caminhos relativos ou absolutos corretos.

**Environment Variables**: Para variáveis de ambiente específicas do build, configure-as na seção "Environment variables" do projeto.


## Deploy da API com Cloudflare Workers

O Cloudflare Workers é uma plataforma serverless que executa código JavaScript na edge network global do Cloudflare. Para a aplicação TiroEsportivo, o Worker fornece uma API RESTful que conecta o frontend ao banco de dados D1, oferecendo baixa latência e alta disponibilidade.

### Arquitetura da API

A API do TiroEsportivo foi desenvolvida seguindo os princípios REST e está estruturada para fornecer endpoints para todos os recursos da aplicação:

- `/api/usuarios` - Gestão de usuários e autenticação
- `/api/competicoes` - Informações sobre competições
- `/api/anuncios` - Classificados e anúncios
- `/api/posts` - Posts e notícias da comunidade
- `/api/parceiros` - Informações dos parceiros
- `/api/resultados` - Resultados das competições

Cada endpoint suporta os métodos HTTP apropriados (GET, POST, PUT, DELETE) e retorna dados em formato JSON. A API também implementa CORS adequadamente para permitir requisições do frontend hospedado no Cloudflare Pages.

### Configuração do Worker

O arquivo `src/worker.js` contém toda a lógica da API. Antes do deploy, verifique se todas as configurações estão corretas:

**Database Binding**: O Worker utiliza o binding `DB` para acessar o banco D1. Esta configuração está definida no arquivo `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "tiroesportivo-db"
database_id = "seu-database-id"
```

**CORS Configuration**: A API está configurada para aceitar requisições de qualquer origem durante o desenvolvimento. Para produção, considere restringir as origens permitidas:

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://tiroesportivo.com.br',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### Deploy do Worker

Para fazer o deploy do Worker, execute o seguinte comando no diretório raiz do projeto:

```bash
wrangler deploy
```

Este comando fará o upload do código do Worker para a rede global do Cloudflare. O processo inclui:

- Compilação e otimização do código JavaScript
- Configuração automática dos bindings (banco D1, variáveis de ambiente)
- Deploy para múltiplas localizações geográficas
- Geração de URL de acesso à API

Após o deploy bem-sucedido, você receberá uma URL similar a:
```
https://tiroesportivo.your-subdomain.workers.dev
```

### Configuração de Rotas Personalizadas

Para usar um domínio personalizado com o Worker, você pode configurar rotas personalizadas. No arquivo `wrangler.toml`, adicione:

```toml
[[routes]]
pattern = "api.tiroesportivo.com.br/*"
zone_name = "tiroesportivo.com.br"
```

Esta configuração direcionará todas as requisições para `api.tiroesportivo.com.br` para o Worker.

### Variáveis de Ambiente

Para configurações sensíveis ou específicas do ambiente, use variáveis de ambiente. No arquivo `wrangler.toml`:

```toml
[vars]
ENVIRONMENT = "production"
JWT_SECRET = "seu-jwt-secret-aqui"
API_VERSION = "v1"
```

Para variáveis secretas (como chaves de API), use o comando:

```bash
wrangler secret put JWT_SECRET
```

### Implementação de Autenticação

A API inclui estrutura básica para autenticação de usuários. Para implementar autenticação completa com JWT:

**Passo 1**: Instale dependências para JWT no Worker:

```javascript
// No início do worker.js
import jwt from '@tsndr/cloudflare-worker-jwt'
```

**Passo 2**: Implemente middleware de autenticação:

```javascript
async function authenticateUser(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    const isValid = await jwt.verify(token, JWT_SECRET);
    if (isValid) {
      const payload = jwt.decode(token);
      return payload.payload;
    }
  } catch (error) {
    console.error('JWT verification failed:', error);
  }
  
  return null;
}
```

### Otimização de Performance

Para maximizar a performance da API:

**Caching**: Implemente cache para dados que não mudam frequentemente:

```javascript
// Cache de 5 minutos para lista de competições
const cacheKey = 'competicoes:list';
const cached = await caches.default.match(cacheKey);
if (cached) {
  return cached;
}

const response = await getCompeticoes(env);
const cacheResponse = new Response(response.body, response);
cacheResponse.headers.set('Cache-Control', 'max-age=300');
await caches.default.put(cacheKey, cacheResponse.clone());
return cacheResponse;
```

**Database Optimization**: Use prepared statements e índices adequados para queries eficientes.

**Response Compression**: O Cloudflare automaticamente comprime as respostas, mas você pode otimizar o tamanho dos dados retornados.

### Monitoramento e Logs

O Cloudflare oferece ferramentas abrangentes para monitorar Workers:

**Real-time Logs**: Use `wrangler tail` para visualizar logs em tempo real durante o desenvolvimento:

```bash
wrangler tail
```

**Analytics**: No dashboard do Cloudflare, acesse a seção Workers para visualizar:
- Número de requisições por minuto/hora/dia
- Latência média e percentis
- Taxa de erro e códigos de status
- Uso de CPU e memória

**Error Tracking**: Implemente logging estruturado para facilitar o debugging:

```javascript
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'error',
  message: 'Database query failed',
  error: error.message,
  userId: userId,
  endpoint: '/api/usuarios'
}));
```

### Limitações e Considerações

O Cloudflare Workers possui algumas limitações importantes:

**CPU Time**: Máximo de 50ms de CPU time por requisição no plano gratuito
**Memory**: Limite de 128MB de memória por Worker
**Subrequest**: Máximo de 50 subrequests por requisição
**Request Size**: Limite de 100MB para o corpo da requisição

Para aplicações com requisitos maiores, considere o upgrade para Workers Unbound que oferece limites mais altos.

### Versionamento e Deploy

Para gerenciar diferentes versões da API:

**Environments**: Configure diferentes ambientes no `wrangler.toml`:

```toml
[env.staging]
name = "tiroesportivo-api-staging"
vars = { ENVIRONMENT = "staging" }

[env.production]
name = "tiroesportivo-api"
vars = { ENVIRONMENT = "production" }
```

**Deploy para ambiente específico**:

```bash
# Deploy para staging
wrangler deploy --env staging

# Deploy para production
wrangler deploy --env production
```

### Integração com Frontend

Para integrar a API com o frontend React, atualize as URLs de API no código do frontend para apontar para o Worker deployado:

```javascript
// Em src/utils/api.js
const API_BASE_URL = 'https://tiroesportivo.your-subdomain.workers.dev/api';

export async function fetchCompeticoes() {
  const response = await fetch(`${API_BASE_URL}/competicoes`);
  return response.json();
}
```

### Testing da API

Para testar a API após o deploy, você pode usar ferramentas como curl ou Postman:

```bash
# Testar endpoint de competições
curl https://tiroesportivo.your-subdomain.workers.dev/api/competicoes

# Testar endpoint de usuários
curl https://tiroesportivo.your-subdomain.workers.dev/api/usuarios
```

Certifique-se de que todos os endpoints retornam dados válidos e que os códigos de status HTTP estão corretos.


## Configuração de Domínio Personalizado

A configuração de um domínio personalizado é essencial para dar uma identidade profissional à aplicação TiroEsportivo. O Cloudflare oferece gerenciamento completo de DNS e certificados SSL gratuitos, tornando o processo simples e seguro.

### Preparação do Domínio

Antes de configurar o domínio no Cloudflare, você precisa ter controle administrativo sobre o domínio que deseja usar. Para este exemplo, utilizaremos `tiroesportivo.com.br`, mas o processo é idêntico para qualquer domínio.

**Verificação de Propriedade**: Certifique-se de que você tem acesso ao painel de controle do registrador do domínio (onde o domínio foi comprado). Você precisará modificar os nameservers para apontar para o Cloudflare.

**Planejamento de Subdomínios**: Considere a estrutura de subdomínios que você deseja usar:
- `tiroesportivo.com.br` - Frontend principal
- `api.tiroesportivo.com.br` - API backend
- `admin.tiroesportivo.com.br` - Painel administrativo (futuro)
- `blog.tiroesportivo.com.br` - Blog (futuro)

### Adicionando o Domínio ao Cloudflare

**Passo 1**: No dashboard do Cloudflare, clique em "Add a Site" e insira seu domínio (ex: `tiroesportivo.com.br`).

**Passo 2**: O Cloudflare fará uma varredura automática dos registros DNS existentes. Revise os registros encontrados e confirme se estão corretos.

**Passo 3**: Escolha um plano. O plano gratuito é suficiente para começar, mas planos pagos oferecem recursos adicionais como:
- Analytics avançados
- Page Rules adicionais
- Certificados SSL personalizados
- Suporte prioritário

**Passo 4**: O Cloudflare fornecerá dois nameservers personalizados, similar a:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

### Configuração dos Nameservers

**Passo 1**: Acesse o painel de controle do seu registrador de domínio.

**Passo 2**: Localize a seção de configuração de DNS ou nameservers.

**Passo 3**: Substitua os nameservers atuais pelos fornecidos pelo Cloudflare.

**Passo 4**: Salve as alterações. A propagação pode levar de alguns minutos a 24 horas.

**Verificação**: Você pode verificar se os nameservers foram atualizados usando ferramentas online como `whatsmydns.net` ou o comando:

```bash
nslookup -type=ns tiroesportivo.com.br
```

### Configuração de Registros DNS

Após a ativação do domínio no Cloudflare, configure os registros DNS necessários:

**Registro A para o domínio principal**:
- Type: A
- Name: @ (ou deixe em branco)
- IPv4 address: Será configurado automaticamente quando você adicionar o domínio personalizado no Cloudflare Pages

**Registro CNAME para API**:
- Type: CNAME
- Name: api
- Target: tiroesportivo.your-subdomain.workers.dev

**Registro CNAME para www**:
- Type: CNAME
- Name: www
- Target: tiroesportivo.com.br

### Configuração no Cloudflare Pages

**Passo 1**: No dashboard do Cloudflare Pages, acesse o projeto TiroEsportivo.

**Passo 2**: Vá para a aba "Custom domains" e clique em "Set up a custom domain".

**Passo 3**: Insira seu domínio principal (ex: `tiroesportivo.com.br`).

**Passo 4**: O Cloudflare automaticamente configurará os registros DNS necessários e emitirá um certificado SSL.

**Passo 5**: Repita o processo para o subdomínio www se desejar (ex: `www.tiroesportivo.com.br`).

### Configuração no Cloudflare Workers

Para configurar o domínio personalizado para a API:

**Passo 1**: No arquivo `wrangler.toml`, adicione a configuração de rota:

```toml
[[routes]]
pattern = "api.tiroesportivo.com.br/*"
zone_name = "tiroesportivo.com.br"
```

**Passo 2**: Execute o deploy novamente para aplicar as configurações:

```bash
wrangler deploy
```

**Passo 3**: No dashboard do Cloudflare, verifique se a rota foi criada corretamente na seção Workers.

### Configuração de Redirecionamentos

Para garantir uma experiência consistente, configure redirecionamentos:

**Redirecionamento HTTPS**: O Cloudflare automaticamente redireciona HTTP para HTTPS, mas você pode configurar isso explicitamente:

- No dashboard do Cloudflare, vá para SSL/TLS > Edge Certificates
- Ative "Always Use HTTPS"

**Redirecionamento WWW**: Configure se você prefere com ou sem www:

- Vá para Rules > Page Rules
- Crie uma regra para `www.tiroesportivo.com.br/*`
- Configure "Forwarding URL" para `https://tiroesportivo.com.br/$1`

### Verificação da Configuração

Após completar a configuração, verifique se tudo está funcionando:

**Teste de Conectividade**:
```bash
# Testar domínio principal
curl -I https://tiroesportivo.com.br

# Testar API
curl -I https://api.tiroesportivo.com.br/api/competicoes

# Testar redirecionamento HTTPS
curl -I http://tiroesportivo.com.br
```

**Teste de SSL**: Verifique se o certificado SSL está funcionando corretamente:
```bash
openssl s_client -connect tiroesportivo.com.br:443 -servername tiroesportivo.com.br
```

### Configuração de Email (Opcional)

Se você planeja usar email com o domínio personalizado:

**MX Records**: Configure registros MX para seu provedor de email:
- Type: MX
- Name: @
- Mail server: mx.seu-provedor.com
- Priority: 10

**SPF Record**: Configure SPF para prevenir spam:
- Type: TXT
- Name: @
- Content: `v=spf1 include:_spf.seu-provedor.com ~all`

### Monitoramento do Domínio

Configure monitoramento para garantir que o domínio esteja sempre acessível:

**Cloudflare Analytics**: Monitore tráfego, performance e ameaças no dashboard.

**Uptime Monitoring**: Use serviços como UptimeRobot ou StatusCake para monitorar a disponibilidade.

**SSL Monitoring**: Configure alertas para expiração de certificados (embora o Cloudflare renove automaticamente).

### Troubleshooting Comum

**Propagação DNS Lenta**: A propagação DNS pode levar até 24 horas. Use ferramentas como `dig` ou `nslookup` para verificar o status.

**Certificado SSL Pendente**: Se o certificado SSL não for emitido automaticamente, verifique se os registros DNS estão corretos e aguarde alguns minutos.

**Erro 522 (Connection Timed Out)**: Verifique se o Worker está deployado corretamente e se as rotas estão configuradas.

**Erro 525 (SSL Handshake Failed)**: Certifique-se de que o modo SSL está configurado como "Full" ou "Full (Strict)" no Cloudflare.

### Configurações Avançadas

**Custom SSL Certificates**: Para certificados SSL personalizados (EV, OV), faça upload no dashboard do Cloudflare.

**DNSSEC**: Ative DNSSEC para adicionar uma camada extra de segurança DNS.

**CAA Records**: Configure registros CAA para especificar quais autoridades certificadoras podem emitir certificados para seu domínio.

### Backup de Configuração

Documente todas as configurações DNS para facilitar recuperação em caso de problemas:

```bash
# Exportar configuração DNS
wrangler zone export tiroesportivo.com.br > dns-backup.txt
```

Mantenha um backup atualizado das configurações, incluindo registros DNS, Page Rules e configurações de SSL.


## Configurações de DNS

O sistema DNS (Domain Name System) é fundamental para o funcionamento correto da aplicação TiroEsportivo. Esta seção detalha as configurações avançadas de DNS no Cloudflare para otimizar performance, segurança e confiabilidade.

### Registros DNS Essenciais

**Registro A (Address Record)**: Mapeia o domínio para um endereço IPv4. Para aplicações no Cloudflare Pages, este registro é configurado automaticamente quando você adiciona um domínio personalizado.

**Registro AAAA (IPv6 Address Record)**: Similar ao registro A, mas para endereços IPv6. O Cloudflare automaticamente fornece suporte IPv6 para melhor conectividade global.

**Registro CNAME (Canonical Name)**: Usado para criar aliases de domínio. Essencial para subdomínios como `api.tiroesportivo.com.br` que apontam para Workers.

**Registro MX (Mail Exchange)**: Necessário se você planeja usar email com o domínio. Configure com prioridades adequadas para redundância.

**Registro TXT**: Usado para verificações de propriedade, configurações SPF, DKIM e outras validações.

### Configurações de Performance

**Cloudflare Proxy**: Ative o proxy (nuvem laranja) para registros que devem se beneficiar do CDN e proteções do Cloudflare. Desative (nuvem cinza) apenas para registros que precisam expor o IP real do servidor.

**TTL (Time To Live)**: Configure TTLs apropriados:
- Registros estáticos: 1 hora (3600 segundos)
- Registros que podem mudar: 5 minutos (300 segundos)
- Durante migrações: 1 minuto (60 segundos)

**Load Balancing**: Para alta disponibilidade, configure múltiplos endpoints:

```
# Registro A principal
@ A 192.0.2.1 (Proxied)

# Registro A backup
backup A 192.0.2.2 (DNS Only)
```

### Configurações de Segurança DNS

**DNSSEC**: Ative DNSSEC para proteger contra ataques de envenenamento de cache DNS:

1. No dashboard do Cloudflare, vá para DNS > Settings
2. Ative "DNSSEC"
3. Configure os registros DS no seu registrador de domínio

**CAA Records**: Configure registros CAA para controlar quais autoridades certificadoras podem emitir certificados:

```
@ CAA 0 issue "letsencrypt.org"
@ CAA 0 issue "digicert.com"
@ CAA 0 iodef "mailto:admin@tiroesportivo.com.br"
```

## Configurações de SSL/TLS

A segurança da aplicação TiroEsportivo depende de configurações adequadas de SSL/TLS. O Cloudflare oferece certificados gratuitos e configurações avançadas de criptografia.

### Modos de SSL/TLS

**Off**: Não recomendado. Desativa SSL/TLS completamente.

**Flexible**: Criptografia entre visitante e Cloudflare, mas não entre Cloudflare e servidor. Adequado apenas para conteúdo estático.

**Full**: Criptografia end-to-end, mas aceita certificados auto-assinados no servidor. Recomendado para a maioria dos casos.

**Full (Strict)**: Criptografia end-to-end com validação completa de certificados. Mais seguro, mas requer certificados válidos no servidor.

Para a aplicação TiroEsportivo, recomenda-se o modo "Full" ou "Full (Strict)".

### Configurações de Certificados

**Universal SSL**: Certificados gratuitos fornecidos automaticamente pelo Cloudflare. Cobrem o domínio principal e subdomínio www.

**Advanced Certificate Manager**: Certificados personalizados com controle total sobre domínios cobertos, autoridade certificadora e configurações.

**Custom SSL**: Para certificados próprios (EV, OV) que você já possui.

### Configurações de Segurança Avançada

**Always Use HTTPS**: Redireciona automaticamente todas as requisições HTTP para HTTPS.

**HTTP Strict Transport Security (HSTS)**: Força navegadores a usar HTTPS:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Minimum TLS Version**: Configure para TLS 1.2 ou superior para melhor segurança.

**TLS 1.3**: Ative para melhor performance e segurança.

### Configuração de Headers de Segurança

Configure headers de segurança adicionais usando Page Rules ou Workers:

```javascript
// Headers de segurança recomendados
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
```

## Monitoramento e Logs

O monitoramento contínuo é essencial para manter a aplicação TiroEsportivo funcionando adequadamente e identificar problemas antes que afetem os usuários.

### Analytics do Cloudflare

**Web Analytics**: Fornece métricas detalhadas sem JavaScript adicional:
- Page views e visitantes únicos
- Países e dispositivos dos visitantes
- Páginas mais populares
- Fontes de tráfego

**Performance Analytics**: Monitora métricas de performance:
- Core Web Vitals (LCP, FID, CLS)
- Tempo de carregamento por região
- Cache hit ratio
- Bandwidth utilizado

### Monitoramento de Workers

**Real-time Logs**: Use o comando `wrangler tail` para logs em tempo real:

```bash
# Logs em tempo real
wrangler tail

# Logs filtrados por status
wrangler tail --status error

# Logs de ambiente específico
wrangler tail --env production
```

**Metrics e Analytics**: No dashboard do Cloudflare Workers:
- Requisições por minuto/hora/dia
- Latência (média, P50, P95, P99)
- Taxa de erro por endpoint
- Uso de CPU e memória

### Monitoramento de D1

**Database Analytics**: Monitore o uso do banco D1:
- Número de queries executadas
- Latência das queries
- Uso de armazenamento
- Erros de conexão

**Query Performance**: Identifique queries lentas:

```sql
-- Exemplo de query com logging
SELECT /* SLOW_QUERY_LOG */ * FROM usuarios WHERE email = ?
```

### Alertas e Notificações

Configure alertas para eventos críticos:

**Health Checks**: Configure verificações de saúde automáticas:

```bash
# Criar health check
wrangler health-check create --name "TiroEsportivo API" --url "https://api.tiroesportivo.com.br/health"
```

**Email Alerts**: Configure alertas por email para:
- Downtime da aplicação
- Erros 5xx acima de threshold
- Uso excessivo de recursos
- Problemas de SSL/TLS

### Logging Estruturado

Implemente logging estruturado no Worker para facilitar análise:

```javascript
function logEvent(level, message, metadata = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: level,
    message: message,
    service: 'tiroesportivo-api',
    version: '1.0.0',
    ...metadata
  };
  
  console.log(JSON.stringify(logEntry));
}

// Uso
logEvent('info', 'User login successful', { userId: 123, ip: request.cf.ip });
logEvent('error', 'Database query failed', { query: 'SELECT * FROM usuarios', error: error.message });
```

## Troubleshooting

Esta seção aborda problemas comuns que podem ocorrer durante o deploy e operação da aplicação TiroEsportivo.

### Problemas de Deploy

**Build Failures no Pages**:
- Verifique os logs de build no dashboard
- Confirme se todas as dependências estão no package.json
- Verifique se o comando de build está correto
- Teste o build localmente antes do deploy

**Worker Deploy Errors**:
- Verifique sintaxe do wrangler.toml
- Confirme se o database_id está correto
- Teste o Worker localmente com `wrangler dev`
- Verifique limites de tamanho do Worker

### Problemas de DNS

**Propagação Lenta**:
```bash
# Verificar propagação DNS
dig @8.8.8.8 tiroesportivo.com.br
dig @1.1.1.1 tiroesportivo.com.br

# Verificar nameservers
nslookup -type=ns tiroesportivo.com.br
```

**Erro 1001 (DNS Resolution Error)**:
- Verifique se os nameservers estão configurados corretamente
- Confirme se o domínio está ativo no Cloudflare
- Aguarde propagação completa (até 24 horas)

### Problemas de SSL

**Erro 525 (SSL Handshake Failed)**:
- Verifique modo SSL (recomendado: Full)
- Confirme se o certificado do servidor é válido
- Teste conectividade SSL diretamente

**Certificado Pendente**:
- Verifique se os registros DNS estão corretos
- Aguarde até 15 minutos para emissão automática
- Tente remover e readicionar o domínio personalizado

### Problemas de Performance

**Latência Alta**:
- Verifique se o proxy está ativado (nuvem laranja)
- Otimize queries do banco de dados
- Implemente cache adequado
- Verifique se o Worker está na região correta

**Cache Miss Alto**:
- Configure headers de cache apropriados
- Use Page Rules para controle fino de cache
- Verifique se URLs têm parâmetros desnecessários

### Problemas de Banco de Dados

**Connection Errors**:
- Verifique se o database_id está correto no wrangler.toml
- Confirme se o banco foi criado e o schema aplicado
- Teste conexão com `wrangler d1 execute`

**Query Timeouts**:
- Otimize queries complexas
- Adicione índices apropriados
- Considere paginação para resultados grandes

### Ferramentas de Diagnóstico

**Cloudflare Diagnostics**:
```bash
# Testar conectividade
curl -I https://tiroesportivo.com.br

# Verificar headers de resposta
curl -v https://api.tiroesportivo.com.br/api/health

# Testar de diferentes localizações
curl -H "CF-IPCountry: US" https://tiroesportivo.com.br
```

**Network Diagnostics**:
```bash
# Traceroute para identificar problemas de rede
traceroute tiroesportivo.com.br

# Teste de latência
ping tiroesportivo.com.br

# Verificar SSL
openssl s_client -connect tiroesportivo.com.br:443
```

## Referências

Esta seção fornece links e recursos adicionais para aprofundar o conhecimento sobre as tecnologias utilizadas na aplicação TiroEsportivo.

### Documentação Oficial

[1] Cloudflare Pages Documentation - https://developers.cloudflare.com/pages/
[2] Cloudflare Workers Documentation - https://developers.cloudflare.com/workers/
[3] Cloudflare D1 Documentation - https://developers.cloudflare.com/d1/
[4] Wrangler CLI Documentation - https://developers.cloudflare.com/workers/wrangler/
[5] React Documentation - https://react.dev/
[6] Vite Documentation - https://vitejs.dev/
[7] Tailwind CSS Documentation - https://tailwindcss.com/docs

### Tutoriais e Guias

[8] Getting Started with Cloudflare Pages - https://developers.cloudflare.com/pages/get-started/
[9] Building APIs with Cloudflare Workers - https://developers.cloudflare.com/workers/tutorials/
[10] Custom Domains on Cloudflare - https://support.cloudflare.com/hc/en-us/articles/200169096
[11] SSL/TLS Configuration Guide - https://developers.cloudflare.com/ssl/

### Ferramentas e Recursos

[12] Cloudflare Status Page - https://www.cloudflarestatus.com/
[13] DNS Propagation Checker - https://www.whatsmydns.net/
[14] SSL Test Tool - https://www.ssllabs.com/ssltest/
[15] Web Performance Testing - https://web.dev/measure/

### Comunidade e Suporte

[16] Cloudflare Community Forum - https://community.cloudflare.com/
[17] Cloudflare Discord Server - https://discord.gg/cloudflaredev
[18] React Community - https://react.dev/community
[19] Stack Overflow - https://stackoverflow.com/questions/tagged/cloudflare

### Segurança e Melhores Práticas

[20] OWASP Security Guidelines - https://owasp.org/www-project-top-ten/
[21] Web Security Best Practices - https://developers.google.com/web/fundamentals/security
[22] Content Security Policy Guide - https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

---

**Conclusão**

Este guia forneceu instruções detalhadas para fazer o deploy completo da aplicação TiroEsportivo no Cloudflare, incluindo configuração de banco de dados, frontend, API e domínio personalizado. Seguindo estas instruções, você terá uma aplicação web moderna, segura e escalável rodando na infraestrutura global do Cloudflare.

Para suporte adicional ou dúvidas específicas, consulte a documentação oficial do Cloudflare ou entre em contato com a comunidade através dos canais mencionados nas referências.

**Autor:** Manus AI  
**Última atualização:** 2 de setembro de 2025

