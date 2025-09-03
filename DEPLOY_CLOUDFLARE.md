# 🚀 **Deploy TiroEsportivo no Cloudflare**

## **Domínio: www.tiroesportivobrasileiro.com.br**

### **📋 Pré-requisitos**
- Conta no Cloudflare (gratuita)
- Domínio registrado no Registro.br
- Wrangler CLI instalado
- Aplicação buildada (pasta `dist/`)

---

## **🗄️ 1. Deploy do Banco de Dados D1**

### **1.1 Criar Database**
```bash
# Criar banco D1
wrangler d1 create tiroesportivo-db

# Copiar o database_id retornado e atualizar wrangler.toml
```

### **1.2 Executar Schema**
```bash
# Aplicar estrutura do banco
wrangler d1 execute tiroesportivo-db --file=database/schema.sql

# Inserir dados iniciais
wrangler d1 execute tiroesportivo-db --file=database/seed.sql
```

### **1.3 Verificar Banco**
```bash
# Listar tabelas
wrangler d1 execute tiroesportivo-db --command="SELECT name FROM sqlite_master WHERE type='table';"

# Verificar dados
wrangler d1 execute tiroesportivo-db --command="SELECT * FROM usuarios LIMIT 5;"
```

---

## **⚡ 2. Deploy da API (Cloudflare Workers)**

### **2.1 Deploy do Worker**
```bash
# Deploy da API
wrangler deploy

# Verificar se está funcionando
curl https://tiroesportivo-api.seu-usuario.workers.dev/api/health
```

### **2.2 Configurar Variáveis de Ambiente**
```bash
# Configurar secrets se necessário
wrangler secret put JWT_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
```

---

## **🌐 3. Deploy do Frontend (Cloudflare Pages)**

### **3.1 Build da Aplicação**
```bash
# Fazer build de produção
pnpm run build

# Verificar se a pasta dist foi criada
ls -la dist/
```

### **3.2 Deploy no Pages**
```bash
# Deploy inicial
wrangler pages deploy dist --project-name=tiroesportivo

# Para deploys subsequentes
wrangler pages deploy dist --project-name=tiroesportivo
```

---

## **🌍 4. Configurar Domínio Personalizado**

### **4.1 Adicionar Domínio no Cloudflare**
1. Acesse o [Dashboard do Cloudflare](https://dash.cloudflare.com)
2. Clique em **"Add a site"**
3. Digite: `tiroesportivobrasileiro.com.br`
4. Escolha o plano **Free**
5. Cloudflare escaneará os DNS records existentes

### **4.2 Configurar Nameservers no Registro.br**
1. Acesse [Registro.br](https://registro.br/)
2. Faça login na sua conta
3. Vá para **"Meus Domínios"**
4. Clique em **"tiroesportivobrasileiro.com.br"**
5. Vá para **"DNS" > "Alterar servidores DNS"**
6. Substitua pelos nameservers fornecidos pelo Cloudflare:
   - `alice.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`
7. Aguarde propagação (2-24 horas)

### **4.3 Configurar DNS Records**
No Cloudflare Dashboard > DNS > Records:

```bash
# Record A para o domínio raiz
Type: A
Name: tiroesportivobrasileiro.com.br
Content: [Será configurado automaticamente pelo Pages]
Proxy: ✅ Enabled (nuvem laranja)

# Record CNAME para www
Type: CNAME  
Name: www
Content: tiroesportivobrasileiro.com.br
Proxy: ✅ Enabled (nuvem laranja)
```

### **4.4 Adicionar Domínio Personalizado no Pages**
1. No Cloudflare Dashboard, vá para **Pages**
2. Clique no projeto **"tiroesportivo"**
3. Vá para **"Custom domains"**
4. Clique **"Set up a custom domain"**
5. Digite: `www.tiroesportivobrasileiro.com.br`
6. Clique **"Continue"**
7. Aguarde ativação do SSL (alguns minutos)

### **4.5 Configurar Redirecionamento**
Para redirecionar `tiroesportivobrasileiro.com.br` para `www`:

1. Vá para **Rules > Redirect Rules**
2. Clique **"Create rule"**
3. Configure:
   - **Rule name**: "Redirect to www"
   - **When incoming requests match**: `hostname equals tiroesportivobrasileiro.com.br`
   - **Then**: `Dynamic redirect`
   - **Expression**: `concat("https://www.tiroesportivobrasileiro.com.br", http.request.uri.path)`
   - **Status code**: `301`

---

## **🔧 5. Configurações Finais**

### **5.1 Configurar Headers de Segurança**
No Cloudflare Dashboard > Security > Settings:

```bash
# Ativar:
- Always Use HTTPS: ON
- Automatic HTTPS Rewrites: ON
- Opportunistic Encryption: ON
- TLS 1.3: ON
```

### **5.2 Configurar Cache**
No Cloudflare Dashboard > Caching > Configuration:

```bash
# Browser Cache TTL: 4 hours
# Caching Level: Standard
```

### **5.3 Configurar Firewall (Opcional)**
No Cloudflare Dashboard > Security > WAF:

```bash
# Ativar proteções básicas:
- OWASP Core Ruleset: ON
- Cloudflare Managed Ruleset: ON
```

---

## **✅ 6. Verificação Final**

### **6.1 Testar URLs**
```bash
# Testar domínio principal
curl -I https://www.tiroesportivobrasileiro.com.br

# Testar redirecionamento
curl -I https://tiroesportivobrasileiro.com.br

# Testar API
curl https://tiroesportivo-api.seu-usuario.workers.dev/api/health
```

### **6.2 Testar Funcionalidades**
1. ✅ Página inicial carrega
2. ✅ Navegação entre páginas funciona
3. ✅ Dashboard exibe dados
4. ✅ Formulários funcionam
5. ✅ SSL/HTTPS ativo
6. ✅ Redirecionamento funciona

---

## **📊 7. Monitoramento**

### **7.1 Analytics**
- Cloudflare Analytics: Tráfego e performance
- Pages Analytics: Deploys e builds
- Workers Analytics: API usage

### **7.2 Logs**
```bash
# Ver logs do Worker
wrangler tail

# Ver logs de deploy do Pages
wrangler pages deployment list --project-name=tiroesportivo
```

---

## **🔄 8. Atualizações Futuras**

### **8.1 Atualizar Frontend**
```bash
# Build e deploy
pnpm run build
wrangler pages deploy dist --project-name=tiroesportivo
```

### **8.2 Atualizar API**
```bash
# Deploy do Worker
wrangler deploy
```

### **8.3 Atualizar Banco**
```bash
# Aplicar migrações
wrangler d1 execute tiroesportivo-db --file=database/migration.sql
```

---

## **🆘 9. Troubleshooting**

### **9.1 Problemas Comuns**

**DNS não propaga:**
- Verificar nameservers no Registro.br
- Aguardar até 24h para propagação completa
- Usar `dig` ou `nslookup` para verificar

**SSL não ativa:**
- Aguardar alguns minutos após configurar domínio
- Verificar se proxy está ativado (nuvem laranja)
- Forçar renovação em SSL/TLS > Edge Certificates

**Aplicação não carrega:**
- Verificar se build foi feito corretamente
- Verificar logs no Pages Dashboard
- Verificar se todas as rotas estão configuradas

### **9.2 Comandos Úteis**
```bash
# Verificar status do domínio
dig www.tiroesportivobrasileiro.com.br

# Testar SSL
openssl s_client -connect www.tiroesportivobrasileiro.com.br:443

# Ver informações do projeto
wrangler pages project list
wrangler d1 list
```

---

## **🎉 Deploy Concluído!**

Sua aplicação TiroEsportivo estará disponível em:
- **🌐 Produção**: https://www.tiroesportivobrasileiro.com.br
- **🔄 Redirecionamento**: https://tiroesportivobrasileiro.com.br → www
- **⚡ API**: https://tiroesportivo-api.seu-usuario.workers.dev

**Recursos Ativos:**
- ✅ Frontend React otimizado
- ✅ API REST completa
- ✅ Banco de dados D1
- ✅ SSL/HTTPS automático
- ✅ CDN global
- ✅ Domínio personalizado
- ✅ Cache inteligente
- ✅ Proteção DDoS

