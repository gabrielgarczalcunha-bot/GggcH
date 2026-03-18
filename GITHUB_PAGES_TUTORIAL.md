# 🚀 Como Criar Site no GitHub - Guia Completo

## 📋 O QUE VOCÊ VAI PRECISAR:

- ✅ Conta no GitHub (grátis)
- ✅ Arquivo `wealth-farm.html`
- ✅ 10 minutos

---

## 🎯 PASSO A PASSO COMPLETO:

### 1️⃣ CRIAR CONTA NO GITHUB

**Se já tem conta, pule para o passo 2**

1. Acesse: **https://github.com**
2. Clique em **"Sign up"** (Cadastrar-se)
3. Preencha:
   - Email
   - Senha
   - Nome de usuário (ex: `wealthfarm123`)
4. Verifique seu email
5. Pronto! Conta criada ✅

---

### 2️⃣ CRIAR REPOSITÓRIO

1. **Faça login** no GitHub

2. No canto superior direito, clique no **+** (mais)

3. Clique em **"New repository"** (Novo repositório)

4. Preencha:
   ```
   Nome do repositório: wealth-farm
   (ou qualquer nome que quiser)
   
   Descrição: Wealth Farm - Investimentos Agrícolas
   
   ✅ Marque: Public (Público)
   ✅ Marque: Add a README file
   ```

5. Clique em **"Create repository"** (Criar repositório)

6. Pronto! Repositório criado ✅

---

### 3️⃣ FAZER UPLOAD DO ARQUIVO HTML

**Método 1: Pelo Site (Mais Fácil)**

1. No seu repositório, clique em **"Add file"** (Adicionar arquivo)

2. Clique em **"Upload files"** (Enviar arquivos)

3. **Arraste** o arquivo `wealth-farm.html` para a área
   - Ou clique em **"choose your files"** e selecione

4. **IMPORTANTE**: Renomeie o arquivo para **`index.html`**
   - GitHub Pages procura por `index.html` como página inicial
   - Para renomear: clique no nome do arquivo após upload

5. Na parte de baixo:
   ```
   Commit message: Adicionar página inicial
   ```

6. Clique em **"Commit changes"** (Confirmar mudanças)

7. Pronto! Arquivo enviado ✅

---

### 4️⃣ ATIVAR GITHUB PAGES

1. No seu repositório, clique em **"Settings"** (Configurações)
   - Fica na barra superior, última opção à direita

2. No menu lateral esquerdo, clique em **"Pages"**
   - Fica na seção "Code and automation"

3. Na seção **"Source"** (Fonte):
   ```
   Branch: main (ou master)
   Folder: / (root)
   ```

4. Clique em **"Save"** (Salvar)

5. Aguarde 1-2 minutos

6. **Recarregue a página** (F5)

7. Verá uma mensagem verde:
   ```
   ✅ Your site is published at:
   https://seu-usuario.github.io/wealth-farm/
   ```

8. **Clique no link** para abrir seu site!

9. Pronto! Site no ar! 🎉

---

## 🔗 SUA URL SERÁ:

```
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
```

**Exemplo:**
```
https://wealthfarm123.github.io/wealth-farm/
```

---

## 📱 AGORA CRIE O APK:

1. Copie a URL do seu site do GitHub

2. Acesse: **https://www.pwabuilder.com**

3. Cole a URL

4. Clique em **"Start"** (Começar)

5. Clique em **"Package for Stores"**

6. Escolha **"Android"**

7. Configure:
   ```
   App Name: Wealth Farm
   Package Name: com.wealthfarm.app
   ```

8. Clique em **"Generate"** (Gerar)

9. Aguarde 2-5 minutos

10. **Download APK**

11. Transfira para seu celular

12. Instale!

---

## 🎨 PASSO A PASSO VISUAL:

### CRIAR CONTA:
```
github.com
  ↓
Sign up
  ↓
Email + Senha + Username
  ↓
Verificar email
  ↓
✅ Conta criada
```

### CRIAR REPOSITÓRIO:
```
GitHub (logado)
  ↓
+ (canto superior direito)
  ↓
New repository
  ↓
Nome: wealth-farm
Public ✅
Add README ✅
  ↓
Create repository
  ↓
✅ Repositório criado
```

### UPLOAD DO HTML:
```
Repositório
  ↓
Add file
  ↓
Upload files
  ↓
Arraste wealth-farm.html
  ↓
Renomeie para: index.html
  ↓
Commit changes
  ↓
✅ Arquivo enviado
```

### ATIVAR PAGES:
```
Settings
  ↓
Pages (menu lateral)
  ↓
Source: main
Folder: / (root)
  ↓
Save
  ↓
Aguardar 1-2 min
  ↓
Recarregar página (F5)
  ↓
✅ Site publicado!
```

---

## 🔧 CONFIGURAÇÕES EXTRAS:

### Adicionar Domínio Próprio (Opcional):

1. Compre um domínio (ex: wealthfarm.com.br)

2. No GitHub Pages → Settings → Pages:
   ```
   Custom domain: seudominio.com
   ```

3. No seu provedor de domínio, adicione:
   ```
   Tipo: CNAME
   Nome: www
   Valor: seu-usuario.github.io
   ```

4. Aguarde propagação (até 24h)

---

## 📝 ATUALIZAR O SITE:

**Quando quiser fazer mudanças:**

1. Baixe o arquivo `index.html` do GitHub

2. Edite no computador

3. No GitHub:
   ```
   Add file → Upload files
   ```

4. Arraste o novo arquivo

5. **Marque**: Replace existing file

6. Commit changes

7. Aguarde 1-2 minutos

8. Site atualizado! ✅

---

## 🆘 PROBLEMAS COMUNS:

### "Site não aparece"
**Solução:**
- Aguarde 2-3 minutos após ativar Pages
- Recarregue a página (Ctrl+F5)
- Verifique se o arquivo se chama `index.html`
- Verifique se Pages está ativado

### "404 Error"
**Solução:**
- Arquivo deve se chamar `index.html` (não `wealth-farm.html`)
- Verifique a URL: `seu-usuario.github.io/repositorio/`
- Repositório deve ser público

### "Página em branco"
**Solução:**
- Abra o Console (F12) e veja os erros
- Verifique se o HTML está completo
- Teste o arquivo localmente primeiro

### "Não encontro Settings"
**Solução:**
- Certifique-se que está no SEU repositório
- Settings fica na barra superior, à direita

---

## 📊 COMPARAÇÃO DE HOSPEDAGEM:

| Serviço | Grátis | Fácil | Rápido | Domínio |
|---------|--------|-------|--------|---------|
| **GitHub Pages** | ✅ Sim | ⭐⭐⭐⭐⭐ | ⚡ Rápido | .github.io |
| Netlify | ✅ Sim | ⭐⭐⭐⭐⭐ | ⚡⚡ Muito | .netlify.app |
| Vercel | ✅ Sim | ⭐⭐⭐⭐ | ⚡⚡ Muito | .vercel.app |
| 000webhost | ✅ Sim | ⭐⭐⭐ | ⚡ Normal | .000webhostapp.com |

---

## 🎯 TUTORIAL EM VÍDEO:

### Pesquise no YouTube:
```
"como hospedar site no github pages"
"github pages tutorial português"
"criar site grátis github"
```

### Canais Recomendados:
- Código Fonte TV
- Rocketseat
- Filipe Deschamps
- Rafaella Ballerini

---

## 📱 MÉTODO ALTERNATIVO: NETLIFY

**Ainda mais fácil que GitHub!**

1. Acesse: **https://www.netlify.com**

2. Faça login (pode usar conta do GitHub)

3. Arraste o arquivo `wealth-farm.html` na área **"Drop"**

4. Aguarde 30 segundos

5. Pronto! Site no ar!

6. URL gerada automaticamente:
   ```
   https://nome-aleatorio.netlify.app
   ```

7. Para personalizar URL:
   ```
   Site settings → Change site name
   ```

**Vantagens do Netlify:**
- ✅ Mais rápido (30 segundos)
- ✅ Não precisa renomear arquivo
- ✅ Deploy automático
- ✅ HTTPS grátis

---

## ✅ CHECKLIST FINAL:

### GitHub Pages:
- [ ] Criar conta no GitHub
- [ ] Criar repositório público
- [ ] Upload do HTML
- [ ] Renomear para `index.html`
- [ ] Ativar GitHub Pages em Settings
- [ ] Aguardar 2 minutos
- [ ] Acessar a URL
- [ ] Site funcionando! ✅

### Netlify (Alternativa):
- [ ] Acessar netlify.com
- [ ] Fazer login
- [ ] Arrastar HTML
- [ ] Site no ar em 30s! ✅

---

## 🔗 LINKS IMPORTANTES:

**GitHub:**
- Criar conta: https://github.com/signup
- Documentação Pages: https://pages.github.com

**Netlify:**
- Site: https://www.netlify.com
- Drop: https://app.netlify.com/drop

**PWABuilder (APK):**
- https://www.pwabuilder.com

**Domínios Baratos:**
- https://registro.br (Brasil)
- https://www.hostinger.com.br
- https://www.godaddy.com

---

## 📞 AJUDA EXTRA:

### Precisa de Ajuda?

**Documentação GitHub:**
```
https://docs.github.com/pt/pages
```

**Comunidade:**
- Stack Overflow (português)
- Reddit: r/github
- Discord: GitHub Community

**Tutoriais:**
- YouTube: "GitHub Pages tutorial"
- FreeCodeCamp
- W3Schools

---

## 🎉 PRONTO!

Agora você tem 2 opções fáceis:

### **Opção 1: GitHub Pages**
✅ Tradicional
✅ Mais controle
✅ Boa para aprender
⏱️ 10 minutos

### **Opção 2: Netlify**
✅ Mais rápido
✅ Super fácil
✅ Deploy automático
⏱️ 30 segundos

**Escolha o que preferir e mãos à obra! 🚀**

---

## 💡 DICA FINAL:

Para compartilhar com amigos:
```
1. Hospede no GitHub ou Netlify
2. Copie a URL
3. Encurte em: bit.ly
4. Compartilhe!
```

**Boa sorte com seu site! 🌱💰**
