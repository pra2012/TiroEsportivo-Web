# 🚀 Guia de Deployment - TiroEsportivo

## ✅ Status Atual

- ✅ **Aplicação completa** com todas as funcionalidades implementadas
- ✅ **Build realizado** com sucesso (pasta `dist/` criada)
- ✅ **Repositório GitHub** criado: https://github.com/pra2012/TiroEsportivo-Web
- ✅ **Arquivos prontos** para deployment

## 📁 Arquivos Disponíveis

1. **`dist/`** - Pasta com build de produção
2. **`tiroesportivo-dist.zip`** - Arquivo ZIP para upload direto
3. **`wrangler.toml`** - Configuração do Cloudflare (atualizada)

## 🎯 Opções de Deployment

### **Opção 1: Upload Direto no Cloudflare Pages (Recomendado)**

1. **Acesse**: https://dash.cloudflare.com/pages
2. **Clique em**: "Create a project"
3. **Escolha**: "Upload assets"
4. **Faça upload** do arquivo `tiroesportivo-dist.zip`
5. **Nome do projeto**: `tiroesportivo-web`
6. **Clique em**: "Deploy site"

### **Opção 2: Via GitHub (Automático)**

1. **Primeiro, faça push do código para o GitHub**:
   ```bash
   # No terminal local ou no GitHub Desktop
   git clone https://github.com/pra2012/TiroEsportivo-Web.git
   # Copie todos os arquivos do projeto para a pasta clonada
   git add .
   git commit -m "Complete TiroEsportivo application"
   git push origin main
   ```

2. **No Cloudflare Pages**:
   - Acesse: https://dash.cloudflare.com/pages
   - Clique em "Create a project"
   - Escolha "Connect to Git"
   - Selecione o repositório `TiroEsportivo-Web`
   - **Build settings**:
     - Build command: `pnpm run build`
     - Build output directory: `dist`
     - Root directory: `/` (deixar vazio)

### **Opção 3: Via Wrangler CLI (Avançado)**

1. **Instale o Wrangler** (se não tiver):
   ```bash
   npm install -g wrangler
   ```

2. **Faça login**:
   ```bash
   wrangler login
   ```

3. **Deploy**:
   ```bash
   wrangler pages deploy dist --project-name=tiroesportivo-web
   ```

## 🌐 Configuração de Domínio Personalizado

Após o deployment, para configurar o domínio `www.tiroesportivobrasileiro.com.br`:

### **No Cloudflare Pages**

1. **Acesse o projeto** deployado
2. **Vá para**: "Custom domains"
3. **Clique em**: "Set up a custom domain"
4. **Digite**: `www.tiroesportivobrasileiro.com.br`
5. **Siga as instruções** para configurar DNS

### **No Registro.br**

1. **Acesse**: https://registro.br
2. **Vá para**: Gerenciamento de DNS
3. **Adicione os registros**:
   ```
   Tipo: CNAME
   Nome: www
   Valor: [URL-do-cloudflare-pages]
   
   Tipo: CNAME  
   Nome: @
   Valor: [URL-do-cloudflare-pages]
   ```

## 🔧 Configurações Adicionais

### **Variáveis de Ambiente** (se necessário)
- `ENVIRONMENT=production`
- `APP_NAME=TiroEsportivo`

### **Redirects e Headers**
Os arquivos `_redirects` e `_headers` já estão configurados na pasta `dist/`.

### **SSL/TLS**
O Cloudflare ativa SSL automaticamente.

## 📊 Funcionalidades da Aplicação

- ✅ **Home**: Landing page completa
- ✅ **Dashboard**: Sistema de níveis por equipamento
- ✅ **Acervo**: Gerenciamento de equipamentos
- ✅ **Atividades**: Registro de treinos com PDF
- ✅ **Resultados**: Análise de competições
- ✅ **Análise**: Gráficos de evolução
- ✅ **Comunidade**: Posts com disclaimer
- ✅ **Perfil**: Gerenciamento completo
- ✅ **Admin**: Painel administrativo
- ✅ **Login**: Google, Facebook e Email
- ✅ **Responsivo**: Mobile e Desktop

## 🎨 Tecnologias Utilizadas

- **React 19** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Recharts** para gráficos
- **Lucide React** para ícones
- **date-fns** para datas brasileiras

## 🚀 URLs Esperadas

- **Desenvolvimento**: `https://[project-name].pages.dev`
- **Produção**: `https://www.tiroesportivobrasileiro.com.br`

## 📞 Suporte

- **Repositório**: https://github.com/pra2012/TiroEsportivo-Web
- **Documentação**: README.md no repositório
- **Cloudflare Docs**: https://developers.cloudflare.com/pages/

---

**🎯 TiroEsportivo** - Sua plataforma completa para tiro esportivo no Brasil!

