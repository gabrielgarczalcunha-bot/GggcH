# 📋 Código Completo do Wealth Farm

## Estrutura do Projeto

```
wealth-farm/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   ├── index.css
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Deposits.jsx
    │   │   ├── Withdrawals.jsx
    │   │   ├── MyLots.jsx
    │   │   ├── Profile.jsx
    │   │   └── AdminPanel.jsx
    │   └── components/
    │       ├── Navigation.jsx
    │       ├── BottomNav.jsx
    │       └── ui/ (componentes Shadcn)
    ├── package.json
    ├── tailwind.config.js
    └── .env
```

## 🔧 Configuração Inicial

### 1. Backend Setup

**requirements.txt**:
```txt
fastapi==0.110.1
uvicorn==0.25.0
python-dotenv>=1.0.1
pymongo==4.5.0
pydantic>=2.6.4
pyjwt>=2.10.1
bcrypt==4.1.3
motor==3.3.1
```

**backend/.env**:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="wealth_farm_db"
CORS_ORIGINS="*"
JWT_SECRET="wealth-farm-secret-key-2024"
```

**Instalar dependências**:
```bash
cd backend
pip install -r requirements.txt
```

**Rodar backend**:
```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### 2. Frontend Setup

**package.json** (dependências principais):
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.5.1",
    "axios": "^1.8.4",
    "sonner": "^2.0.3",
    "lucide-react": "^0.507.0",
    "@radix-ui/react-*": "(vários componentes Shadcn)",
    "tailwindcss": "^3.4.17"
  }
}
```

**frontend/.env**:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```
*(Para produção, use a URL do seu servidor)*

**Instalar dependências**:
```bash
cd frontend
npm install
# ou
yarn install
```

**Rodar frontend**:
```bash
npm start
# ou
yarn start
```

## 📁 Arquivos Principais

### Backend - server.py

O arquivo `server.py` contém:
- **Modelos Pydantic**: User, Lot, Deposit, Withdraw
- **Autenticação**: JWT com bcrypt
- **Endpoints**:
  - `/api/auth/register` - Registro de usuário
  - `/api/auth/login` - Login
  - `/api/lots/prices` - Preços dos lotes
  - `/api/lots/purchase` - Comprar lote
  - `/api/lots/my-lots` - Meus lotes
  - `/api/deposits/request` - Solicitar depósito
  - `/api/withdrawals/request` - Solicitar saque
  - `/api/admin/*` - Endpoints administrativos

Ver arquivo completo em: `/app/backend/server.py`

### Frontend - Páginas Principais

#### 1. **Dashboard.jsx**
- Header com imagem de fundo
- Cards de saldo e rendimentos
- Pacotes de investimento (Porquinho Poupança, Vaca Leiteira, Fazenda Completa)
- Banner de indicação
- Navegação inferior

#### 2. **Deposits.jsx**
- Formulário de valor de depósito
- QR Code PIX
- Código PIX copia e cola
- Upload de comprovante
- Histórico de depósitos

#### 3. **Withdrawals.jsx**
- Formulário de saque
- Cálculo de taxa (10%)
- Seleção de tipo de chave PIX
- Histórico de saques

#### 4. **MyLots.jsx**
- Lista de lotes ativos
- Rendimentos acumulados
- Barra de progresso
- Botão de retirada de rendimentos

#### 5. **AdminPanel.jsx**
- Estatísticas gerais
- Aprovação/rejeição de depósitos
- Aprovação/rejeição de saques
- Lista de usuários

#### 6. **Profile.jsx**
- Informações do usuário
- Código de indicação
- Sobre a empresa
- Certificações

## 🎨 Componentes de UI

### Navigation.jsx
Navegação superior com:
- Logo
- Menu desktop
- Menu mobile (hamburger)
- Botão de logout

### BottomNav.jsx
Navegação inferior fixa com 5 ícones:
- Início
- Recarga
- Lotes
- Saque
- Perfil

### Componentes Shadcn UI
Localização: `/app/frontend/src/components/ui/`

Componentes usados:
- Button
- Card
- Input
- Label
- Select
- Progress
- Tabs
- Dialog
- Toast (Sonner)

## 🗄️ Banco de Dados MongoDB

### Coleções:

**1. users**
```javascript
{
  id: String (UUID),
  phone: String,
  password: String (hashed),
  balance: Number,
  total_earnings: Number,
  referral_code: String,
  referred_by: String (optional),
  is_admin: Boolean,
  created_at: String (ISO date)
}
```

**2. lots**
```javascript
{
  id: String (UUID),
  user_id: String,
  lot_type: Number (1, 2, 3),
  invested_amount: Number,
  current_earnings: Number,
  hourly_rate: Number,
  total_hours: Number (720),
  hours_elapsed: Number,
  status: String (active, completed, withdrawn),
  purchased_at: String (ISO date),
  last_update: String (ISO date)
}
```

**3. deposits**
```javascript
{
  id: String (UUID),
  user_id: String,
  amount: Number,
  proof_image_url: String,
  status: String (pending, approved, rejected),
  created_at: String (ISO date),
  updated_at: String (ISO date)
}
```

**4. withdrawals**
```javascript
{
  id: String (UUID),
  user_id: String,
  amount: Number,
  fee: Number,
  net_amount: Number,
  pix_key_type: String,
  pix_key: String,
  status: String (pending, approved, rejected),
  created_at: String (ISO date),
  updated_at: String (ISO date)
}
```

## 🔐 Fluxo de Autenticação

1. Usuário faz registro/login
2. Backend gera JWT token
3. Token é armazenado no localStorage do navegador
4. Cada requisição inclui o token no header: `Authorization: Bearer <token>`
5. Backend valida token antes de processar requisição

## 💰 Lógica de Negócio

### Sistema de Lotes:
1. **Porquinho Poupança** (R$ 30): R$ 0,10/hora × 720h = R$ 72 (lucro: R$ 42)
2. **Vaca Leiteira** (R$ 100): R$ 0,35/hora × 720h = R$ 252 (lucro: R$ 152)
3. **Fazenda Completa** (R$ 300): R$ 1,05/hora × 720h = R$ 756 (lucro: R$ 456)

### Sistema de Indicação:
- Usuário compartilha link: `/register/{referral_code}`
- Novo usuário se cadastra com o código
- Quando faz primeiro depósito ≥ R$ 30
- Indicador recebe R$ 10 de bônus

### Sistema de Saque:
- Valor mínimo: R$ 45
- Taxa: 10%
- Aprovação manual pelo admin
- Pagamento via PIX

## 🚀 Deploy

### Backend (Railway/Render):
1. Conecte repositório Git
2. Configure variáveis de ambiente
3. Deploy automático

### Frontend (Vercel/Netlify):
1. Conecte repositório Git
2. Configure `REACT_APP_BACKEND_URL`
3. Deploy automático

### MongoDB (Atlas):
1. Crie cluster gratuito em mongodb.com/atlas
2. Copie connection string
3. Atualize `MONGO_URL` no backend

## 📱 Gerar APK

Ver arquivo completo: `/app/GUIA_APK.md`

Resumo:
```bash
# 1. Instalar Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Inicializar
npx cap init

# 3. Build
npm run build

# 4. Adicionar Android
npx cap add android

# 5. Sync
npx cap sync

# 6. Abrir Android Studio
npx cap open android

# 7. Build APK no Android Studio
Build > Build APK(s)
```

## 🔗 Links Úteis

- **Backend API**: https://wealth-farm-clone.preview.emergentagent.com/api
- **Frontend**: https://wealth-farm-clone.preview.emergentagent.com
- **Admin Login**: 51920020786 / @N1collas

## 📞 Credenciais PIX

**Código PIX**:
```
00020101021126580014br.gov.bcb.pix0136223ed24f-4b1a-46fe-993c-10e16a2fb7935204000053039865802BR5918GABRIEL G DA CUNHA6006ESTEIO62070503***630454FB
```

**Destinatário**: GABRIEL G DA CUNHA

---

**Todo o código está disponível em: `/app/`**

Para baixar:
1. Via Emergent: Botão "Download Code"
2. Via Git: `git clone <repo-url>`
3. Via ZIP: Compactar pasta `/app/`
