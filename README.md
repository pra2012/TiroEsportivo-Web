# 🎯 TiroEsportivo

Uma aplicação web completa para gerenciamento de tiro esportivo, desenvolvida com React e otimizada para deploy no Cloudflare Pages.

## 🌟 Funcionalidades

### 📱 **Interface Completa**
- **Home**: Landing page com notícias, competições e parceiros
- **Dashboard**: Sistema avançado de níveis por equipamento/calibre
- **Acervo**: Gerenciamento completo de equipamentos
- **Atividades**: Registro de treinos com extração automática de PDF
- **Resultados**: Análise de competições com gráficos
- **Análise**: Gráficos de evolução de desempenho
- **Comunidade**: Posts e interação social com disclaimer
- **Perfil**: Gerenciamento completo com 2FA

### 👑 **Painel Administrativo**
- **Gerenciar Usuários**: CRUD completo com permissões
- **Gerenciar Parceiros**: Logos, links e redes sociais
- **Sistema de Permissões**: User, Parceiro, Administrador

### 🔐 **Sistema de Autenticação**
- **Login Social**: Google e Facebook OAuth
- **Login Tradicional**: Email/senha com validação
- **Persistência**: localStorage com tokens JWT

### 🤖 **Funcionalidades Avançadas**
- **PdfExtractor**: Extração automática de dados de competições
- **Sistema de Níveis**: Cálculo automático baseado em atividades
- **Formatação Brasileira**: Datas em dd/mm/yyyy
- **Responsivo**: Interface adaptada para mobile e desktop

## 🚀 Deploy no Cloudflare Pages

### **Método 1: Via GitHub (Recomendado)**

1. **Fork ou Clone este repositório**
2. **Acesse o Cloudflare Dashboard**
3. **Vá para Pages > Create a project**
4. **Conecte seu GitHub** e selecione este repositório
5. **Configure o build**:
   - **Build command**: `pnpm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (deixar vazio)
   - **Node.js version**: `20.x`

### **Método 2: Upload Direto**

1. **Clone o repositório**:
   ```bash
   git clone <URL_DO_SEU_REPO>
   cd TiroEsportivo
   ```

2. **Instale dependências**:
   ```bash
   pnpm install
   ```

3. **Faça o build**:
   ```bash
   pnpm run build
   ```

4. **Upload da pasta `dist/`** no Cloudflare Pages

## 🔧 Configuração do Cloudflare

### **Variáveis de Ambiente**
Não são necessárias variáveis de ambiente para a versão atual (usa dados mock).

### **Domínio Personalizado**
1. **Adicione seu domínio** no Cloudflare DNS
2. **Configure CNAME** apontando para o Cloudflare Pages
3. **Ative SSL/TLS** automático

### **Redirects e Headers**
Os arquivos `_redirects` e `_headers` já estão configurados na pasta `dist/`.

## 🛠️ Desenvolvimento Local

### **Pré-requisitos**
- Node.js 20.x
- pnpm (recomendado) ou npm

### **Instalação**
```bash
# Clone o repositório
git clone <URL_DO_SEU_REPO>
cd TiroEsportivo

# Instale dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm run dev

# Acesse http://localhost:5173
```

### **Scripts Disponíveis**
```bash
pnpm run dev      # Servidor de desenvolvimento
pnpm run build    # Build para produção
pnpm run preview  # Preview do build local
pnpm run lint     # Verificação de código
```

## 📁 Estrutura do Projeto

```
TiroEsportivo/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes de interface (shadcn/ui)
│   │   ├── atividades/     # Componentes específicos de atividades
│   │   ├── dashboard/      # Componentes do dashboard
│   │   ├── AcervoForm.jsx  # Formulário de equipamentos
│   │   ├── AnuncioForm.jsx # Formulário de anúncios
│   │   ├── DisclaimerModal.jsx # Modal de termos
│   │   ├── Layout.jsx      # Layout principal
│   │   ├── ParceiroForm.jsx # Formulário de parceiros
│   │   └── PostForm.jsx    # Formulário de posts
│   ├── contexts/           # Contextos React
│   │   └── GlobalUploadContext.jsx
│   ├── entities/           # Modelos de dados
│   │   └── all.js         # Entidades e dados mock
│   ├── pages/             # Páginas da aplicação
│   │   ├── admin/         # Páginas administrativas
│   │   ├── HomePage.jsx   # Página inicial
│   │   ├── DashboardPage.jsx # Dashboard principal
│   │   ├── AtividadesPage.jsx # Gestão de atividades
│   │   ├── ComunidadePage.jsx # Comunidade
│   │   ├── LoginPage.jsx  # Sistema de login
│   │   └── ...           # Outras páginas
│   ├── utils/            # Utilitários
│   │   ├── dateUtils.js  # Formatação de datas
│   │   └── index.js      # Utilitários gerais
│   ├── App.jsx           # Componente raiz
│   └── main.jsx          # Ponto de entrada
├── database/             # Esquemas de banco (Cloudflare D1)
│   ├── schema.sql        # Estrutura das tabelas
│   └── seed.sql          # Dados iniciais
├── public/               # Arquivos estáticos
├── dist/                 # Build de produção
├── wrangler.toml         # Configuração Cloudflare Workers
└── package.json          # Dependências e scripts
```

## 🗄️ Banco de Dados (Cloudflare D1)

### **Configuração Opcional**
Para funcionalidades avançadas com banco real:

1. **Crie um banco D1**:
   ```bash
   wrangler d1 create tiroesportivo-db
   ```

2. **Execute o schema**:
   ```bash
   wrangler d1 execute tiroesportivo-db --file=database/schema.sql
   wrangler d1 execute tiroesportivo-db --file=database/seed.sql
   ```

3. **Configure o Worker** (opcional para API):
   ```bash
   wrangler deploy
   ```

## 🎨 Tecnologias Utilizadas

### **Frontend**
- **React 19** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones
- **Recharts** - Gráficos interativos
- **React Router** - Roteamento
- **date-fns** - Manipulação de datas

### **Deploy & Infraestrutura**
- **Cloudflare Pages** - Hospedagem frontend
- **Cloudflare D1** - Banco de dados (opcional)
- **Cloudflare Workers** - API backend (opcional)

## 📋 Funcionalidades por Tipo de Usuário

### **👤 Usuário**
- Dashboard com estatísticas pessoais
- Gerenciamento de acervo
- Registro de atividades
- Análise de resultados
- Participação na comunidade

### **🤝 Parceiro**
- Todas as funcionalidades de usuário
- Criação de anúncios promocionais
- Gestão de perfil de parceiro

### **👑 Administrador**
- Todas as funcionalidades anteriores
- Gerenciamento de usuários
- Gerenciamento de parceiros
- Moderação da comunidade
- Acesso a relatórios avançados

## 🔒 Segurança e Privacidade

- **Disclaimer obrigatório** sobre legislação de tiro esportivo
- **Validação de dados** em formulários
- **Sanitização** de inputs do usuário
- **Headers de segurança** configurados
- **SSL/TLS** automático via Cloudflare

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- **Desktop** (1920px+)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🐛 Debugging

### **Logs Disponíveis**
- Console do navegador para PdfExtractor
- Estados de loading em todas as operações
- Mensagens de erro específicas
- Feedback visual para ações do usuário

### **Desenvolvimento**
```bash
# Modo de desenvolvimento com hot reload
pnpm run dev

# Build de produção com análise
pnpm run build

# Preview do build local
pnpm run preview
```

## 📞 Suporte

Para dúvidas sobre:
- **Funcionalidades**: Consulte a documentação inline
- **Deploy**: Siga as instruções deste README
- **Bugs**: Verifique o console do navegador
- **Melhorias**: Contribuições são bem-vindas!

## 📄 Licença

Este projeto foi desenvolvido para demonstração de funcionalidades de tiro esportivo.

---

**🎯 TiroEsportivo** - Sua plataforma completa para tiro esportivo no Brasil!

