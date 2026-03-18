# 📱 Como Criar APK do Wealth Farm

## 📥 Parte 1: Baixar o Código Completo

### Opção A: Via Interface do Emergent
1. No painel do Emergent, clique em **"Download Code"** ou **"Export Project"**
2. Isso baixará um arquivo ZIP com todo o código

### Opção B: Via Git (Recomendado)
Se você tem acesso ao repositório Git:
```bash
git clone <url-do-repositorio>
cd wealth-farm-clone
```

---

## 🚀 Parte 2: Converter para APK Android

### Método 1: Usando Capacitor (Recomendado - Mais Profissional)

#### Passo 1: Instalar Dependências
```bash
# No diretório do projeto
cd frontend

# Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Inicializar Capacitor
npx cap init
# Nome do app: Wealth Farm
# Package ID: com.wealthfarm.app
```

#### Passo 2: Configurar o Backend URL
Edite `frontend/.env`:
```env
REACT_APP_BACKEND_URL=https://wealth-farm-clone.preview.emergentagent.com
```

#### Passo 3: Build do Frontend
```bash
npm run build
```

#### Passo 4: Adicionar Plataforma Android
```bash
npx cap add android
```

#### Passo 5: Copiar Assets
```bash
npx cap copy
npx cap sync
```

#### Passo 6: Abrir no Android Studio
```bash
npx cap open android
```

#### Passo 7: Gerar APK no Android Studio
1. No Android Studio, vá em: **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Aguarde o build completar
3. O APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

---

### Método 2: Usando Expo (Mais Rápido mas limitado)

⚠️ **Nota**: Este método requer converter React para React Native primeiro.

#### Passo 1: Criar conta no Expo
```bash
npm install -g expo-cli
expo login
```

#### Passo 2: Inicializar projeto Expo
```bash
npx create-expo-app wealth-farm-mobile
cd wealth-farm-mobile
```

#### Passo 3: Copiar componentes
- Copie os componentes React para React Native
- Substitua componentes web por nativos (exemplo: `<div>` → `<View>`)

#### Passo 4: Build
```bash
expo build:android
```

---

### Método 3: PWA para APK (Mais Simples)

Use ferramentas online para converter PWA em APK:

#### Opção A: PWABuilder.com
1. Acesse: https://www.pwabuilder.com/
2. Cole a URL: `https://wealth-farm-clone.preview.emergentagent.com`
3. Clique em "Package for Stores"
4. Escolha "Android" e baixe o APK

#### Opção B: APKPure
1. Acesse: https://apkpure.com/apk-maker
2. Siga o processo de conversão

---

## 📦 Parte 3: Estrutura do Código

### Backend (FastAPI + MongoDB)
```
/app/backend/
├── server.py          # API principal com todos os endpoints
├── requirements.txt   # Dependências Python
└── .env              # Variáveis de ambiente
```

### Frontend (React)
```
/app/frontend/
├── src/
│   ├── App.js                    # App principal com rotas
│   ├── pages/
│   │   ├── Login.jsx            # Tela de login
│   │   ├── Register.jsx         # Tela de cadastro
│   │   ├── Dashboard.jsx        # Dashboard principal
│   │   ├── Deposits.jsx         # Tela de depósitos
│   │   ├── Withdrawals.jsx      # Tela de saques
│   │   ├── MyLots.jsx           # Meus lotes
│   │   ├── Profile.jsx          # Perfil do usuário
│   │   └── AdminPanel.jsx       # Painel administrativo
│   └── components/
│       ├── Navigation.jsx       # Navegação superior
│       ├── BottomNav.jsx        # Navegação inferior
│       └── ui/                  # Componentes Shadcn
├── package.json                 # Dependências Node
└── .env                         # Variáveis de ambiente
```

---

## 🔑 Credenciais de Admin

- **Telefone**: 51920020786
- **Senha**: @N1collas

---

## 🌐 Deploy do Backend

### Opção 1: Manter no Emergent
O backend já está rodando em:
```
https://wealth-farm-clone.preview.emergentagent.com/api
```

### Opção 2: Deploy Próprio (Railway, Render, Heroku)

#### Railway:
1. Crie conta em railway.app
2. Novo projeto → Deploy from GitHub
3. Adicione variáveis de ambiente:
   - `MONGO_URL`
   - `DB_NAME`
   - `JWT_SECRET`

#### Render:
1. Crie conta em render.com
2. New Web Service
3. Conecte o repositório
4. Configure variáveis de ambiente

---

## 📱 Publicar na Google Play Store

### Requisitos:
1. Conta Google Play Console (taxa única de $25)
2. APK assinado (não debug)

### Passos:
1. **Gerar Keystore**:
```bash
keytool -genkey -v -keystore wealth-farm.keystore -alias wealth-farm -keyalg RSA -keysize 2048 -validity 10000
```

2. **Assinar APK**:
No Android Studio:
- Build > Generate Signed Bundle / APK
- Escolha "APK"
- Selecione o keystore criado
- Build "Release"

3. **Upload na Play Store**:
- Acesse Google Play Console
- Criar novo app
- Upload do APK assinado
- Preencher informações (descrição, screenshots, etc.)
- Enviar para revisão

---

## 🔐 Segurança

### Para Produção:
1. ✅ Use HTTPS sempre
2. ✅ Nunca commite arquivos .env no Git
3. ✅ Mude JWT_SECRET para valor seguro
4. ✅ Configure CORS corretamente
5. ✅ Adicione rate limiting
6. ✅ Valide todas as entradas de usuário
7. ✅ Use MongoDB Atlas (cloud) ao invés de local

---

## 📞 Suporte

Se precisar de ajuda:
1. Documen tação Capacitor: https://capacitorjs.com/docs
2. React Native: https://reactnative.dev/
3. Android Studio: https://developer.android.com/studio

---

## ✅ Checklist Final

- [ ] Código baixado
- [ ] Backend funcionando
- [ ] Frontend buildado
- [ ] APK gerado
- [ ] APK testado em dispositivo real
- [ ] Screenshots para Play Store preparados
- [ ] Descrição do app escrita
- [ ] Ícone e logo do app criados
- [ ] Conta Google Play Console criada
- [ ] APK assinado e enviado

**Boa sorte com seu app! 🚀**
