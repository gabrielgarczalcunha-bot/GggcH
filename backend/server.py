from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'wealth-farm-secret-key-2024')
JWT_ALGORITHM = 'HS256'

security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============= MODELS =============

class UserRegister(BaseModel):
    phone: str
    password: str
    referred_by: Optional[str] = None

class UserLogin(BaseModel):
    phone: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    phone: str
    balance: float = 0.0
    total_earnings: float = 0.0
    referral_code: str
    referred_by: Optional[str] = None
    is_admin: bool = False
    created_at: str

class LotPurchase(BaseModel):
    lot_type: int  # 1, 2, or 3

class Lot(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    lot_type: int
    invested_amount: float
    current_earnings: float
    hourly_rate: float
    total_hours: int = 720  # 30 days
    hours_elapsed: int = 0
    status: str  # active, completed, withdrawn
    purchased_at: str
    last_update: str

class DepositRequest(BaseModel):
    amount: float
    proof_image_url: str

class Deposit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    amount: float
    proof_image_url: str
    status: str  # pending, approved, rejected
    created_at: str
    updated_at: str

class WithdrawRequest(BaseModel):
    amount: float
    pix_key_type: str  # cpf, phone, email, random
    pix_key: str

class Withdraw(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    amount: float
    fee: float
    net_amount: float
    pix_key_type: str
    pix_key: str
    status: str  # pending, approved, rejected
    created_at: str
    updated_at: str

class ApprovalRequest(BaseModel):
    transaction_id: str
    approved: bool

# ============= AUTH HELPERS =============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, phone: str, is_admin: bool) -> str:
    payload = {
        'user_id': user_id,
        'phone': phone,
        'is_admin': is_admin,
        'exp': datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({'id': payload['user_id']}, {'_id': 0})
        if not user:
            raise HTTPException(status_code=401, detail='User not found')
        return User(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid token')

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail='Admin access required')
    return current_user

# ============= ROUTES =============

@api_router.post("/auth/register")
async def register(data: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({'phone': data.phone}, {'_id': 0})
    if existing:
        raise HTTPException(status_code=400, detail='Phone already registered')
    
    user_id = str(uuid.uuid4())
    referral_code = str(uuid.uuid4())[:8].upper()
    
    # Check if admin phone
    is_admin = data.phone == '51920020786'
    
    user_doc = {
        'id': user_id,
        'phone': data.phone,
        'password': hash_password(data.password),
        'balance': 0.0,
        'total_earnings': 0.0,
        'referral_code': referral_code,
        'referred_by': data.referred_by,
        'is_admin': is_admin,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id, data.phone, is_admin)
    user_doc.pop('password')
    
    return {'token': token, 'user': User(**user_doc)}

@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({'phone': data.phone}, {'_id': 0})
    if not user or not verify_password(data.password, user['password']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    token = create_token(user['id'], user['phone'], user.get('is_admin', False))
    user.pop('password')
    
    return {'token': token, 'user': User(**user)}

@api_router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.get("/lots/prices")
async def get_lot_prices():
    return {
        'lots': [
            {'type': 1, 'name': 'Porquinho Poupança', 'price': 30.0, 'hourly_rate': 0.10, 'total_return': 72.0, 'duration_days': 30, 'image': 'https://static.prod-images.emergentagent.com/jobs/c828b448-09dd-4e01-9208-f245ab52da70/images/e8da3c7d0435b7cf433ec59393eaafc3b4d4af30dbcf08adfdacdb4eea160acd.png'},
            {'type': 2, 'name': 'Vaca Leiteira', 'price': 100.0, 'hourly_rate': 0.35, 'total_return': 252.0, 'duration_days': 30, 'image': 'https://static.prod-images.emergentagent.com/jobs/c828b448-09dd-4e01-9208-f245ab52da70/images/3dc1e923f57e6c18cba5dde33ad09f2f0cdf379a46fed39b03bea3d61f6b64b2.png'},
            {'type': 3, 'name': 'Fazenda Completa', 'price': 300.0, 'hourly_rate': 1.05, 'total_return': 756.0, 'duration_days': 30, 'image': 'https://static.prod-images.emergentagent.com/jobs/c828b448-09dd-4e01-9208-f245ab52da70/images/fc5415fdee455300c66689886df01a7894da6e3171a2ea4d7107170f58eab07e.png'}
        ]
    }

@api_router.post("/lots/purchase")
async def purchase_lot(data: LotPurchase, current_user: User = Depends(get_current_user)):
    # Get lot details
    lot_prices = {1: 30.0, 2: 100.0, 3: 300.0}
    hourly_rates = {1: 0.10, 2: 0.35, 3: 1.05}
    
    if data.lot_type not in lot_prices:
        raise HTTPException(status_code=400, detail='Invalid lot type')
    
    price = lot_prices[data.lot_type]
    hourly_rate = hourly_rates[data.lot_type]
    
    # Check balance
    user = await db.users.find_one({'id': current_user.id}, {'_id': 0})
    if user['balance'] < price:
        raise HTTPException(status_code=400, detail='Insufficient balance')
    
    # Deduct balance
    await db.users.update_one(
        {'id': current_user.id},
        {'$inc': {'balance': -price}}
    )
    
    # Create lot
    lot_doc = {
        'id': str(uuid.uuid4()),
        'user_id': current_user.id,
        'lot_type': data.lot_type,
        'invested_amount': price,
        'current_earnings': 0.0,
        'hourly_rate': hourly_rate,
        'total_hours': 720,
        'hours_elapsed': 0,
        'status': 'active',
        'purchased_at': datetime.now(timezone.utc).isoformat(),
        'last_update': datetime.now(timezone.utc).isoformat()
    }
    
    await db.lots.insert_one(lot_doc)
    
    return {'message': 'Lot purchased successfully', 'lot': Lot(**lot_doc)}

@api_router.get("/lots/my-lots")
async def get_my_lots(current_user: User = Depends(get_current_user)):
    lots = await db.lots.find({'user_id': current_user.id}, {'_id': 0}).to_list(100)
    
    # Update earnings for each active lot
    for lot in lots:
        if lot['status'] == 'active':
            last_update = datetime.fromisoformat(lot['last_update'])
            now = datetime.now(timezone.utc)
            hours_passed = int((now - last_update).total_seconds() / 3600)
            
            if hours_passed > 0:
                new_hours = min(lot['hours_elapsed'] + hours_passed, lot['total_hours'])
                hours_to_add = new_hours - lot['hours_elapsed']
                earnings_to_add = hours_to_add * lot['hourly_rate']
                
                lot['hours_elapsed'] = new_hours
                lot['current_earnings'] = lot['current_earnings'] + earnings_to_add
                lot['last_update'] = now.isoformat()
                
                if lot['hours_elapsed'] >= lot['total_hours']:
                    lot['status'] = 'completed'
                
                await db.lots.update_one(
                    {'id': lot['id']},
                    {'$set': {
                        'hours_elapsed': lot['hours_elapsed'],
                        'current_earnings': lot['current_earnings'],
                        'last_update': lot['last_update'],
                        'status': lot['status']
                    }}
                )
    
    return {'lots': [Lot(**lot) for lot in lots]}

@api_router.post("/lots/{lot_id}/withdraw-earnings")
async def withdraw_lot_earnings(lot_id: str, current_user: User = Depends(get_current_user)):
    lot = await db.lots.find_one({'id': lot_id, 'user_id': current_user.id}, {'_id': 0})
    
    if not lot:
        raise HTTPException(status_code=404, detail='Lot not found')
    
    if lot['current_earnings'] <= 0:
        raise HTTPException(status_code=400, detail='No earnings to withdraw')
    
    # Add earnings to user balance
    await db.users.update_one(
        {'id': current_user.id},
        {'$inc': {'balance': lot['current_earnings'], 'total_earnings': lot['current_earnings']}}
    )
    
    # Reset lot earnings
    await db.lots.update_one(
        {'id': lot_id},
        {'$set': {'current_earnings': 0.0, 'status': 'withdrawn'}}
    )
    
    return {'message': 'Earnings withdrawn successfully', 'amount': lot['current_earnings']}

@api_router.post("/deposits/request")
async def request_deposit(data: DepositRequest, current_user: User = Depends(get_current_user)):
    deposit_doc = {
        'id': str(uuid.uuid4()),
        'user_id': current_user.id,
        'amount': data.amount,
        'proof_image_url': data.proof_image_url,
        'status': 'pending',
        'created_at': datetime.now(timezone.utc).isoformat(),
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.deposits.insert_one(deposit_doc)
    
    return {'message': 'Deposit request submitted', 'deposit': Deposit(**deposit_doc)}

@api_router.get("/deposits/my-deposits")
async def get_my_deposits(current_user: User = Depends(get_current_user)):
    deposits = await db.deposits.find({'user_id': current_user.id}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return {'deposits': [Deposit(**d) for d in deposits]}

@api_router.post("/withdrawals/request")
async def request_withdrawal(data: WithdrawRequest, current_user: User = Depends(get_current_user)):
    # Check minimum
    if data.amount < 45:
        raise HTTPException(status_code=400, detail='Minimum withdrawal is R$ 45')
    
    # Calculate fee
    fee = data.amount * 0.10
    net_amount = data.amount - fee
    
    # Check balance
    user = await db.users.find_one({'id': current_user.id}, {'_id': 0})
    if user['balance'] < data.amount:
        raise HTTPException(status_code=400, detail='Insufficient balance')
    
    # Deduct from balance
    await db.users.update_one(
        {'id': current_user.id},
        {'$inc': {'balance': -data.amount}}
    )
    
    withdraw_doc = {
        'id': str(uuid.uuid4()),
        'user_id': current_user.id,
        'amount': data.amount,
        'fee': fee,
        'net_amount': net_amount,
        'pix_key_type': data.pix_key_type,
        'pix_key': data.pix_key,
        'status': 'pending',
        'created_at': datetime.now(timezone.utc).isoformat(),
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.withdrawals.insert_one(withdraw_doc)
    
    return {'message': 'Withdrawal request submitted', 'withdrawal': Withdraw(**withdraw_doc)}

@api_router.get("/withdrawals/my-withdrawals")
async def get_my_withdrawals(current_user: User = Depends(get_current_user)):
    withdrawals = await db.withdrawals.find({'user_id': current_user.id}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return {'withdrawals': [Withdraw(**w) for w in withdrawals]}

@api_router.get("/referrals/stats")
async def get_referral_stats(current_user: User = Depends(get_current_user)):
    # Count referred users
    referred_users = await db.users.count_documents({'referred_by': current_user.referral_code})
    
    # Get referral earnings (R$10 per first deposit of R$30+)
    referral_earnings = referred_users * 10  # Simplified
    
    return {
        'referral_code': current_user.referral_code,
        'total_referrals': referred_users,
        'total_earnings': referral_earnings
    }

# ============= ADMIN ROUTES =============

@api_router.get("/admin/deposits/pending")
async def get_pending_deposits(admin: User = Depends(get_admin_user)):
    deposits = await db.deposits.find({'status': 'pending'}, {'_id': 0}).sort('created_at', -1).to_list(100)
    
    # Get user info for each deposit
    result = []
    for dep in deposits:
        user = await db.users.find_one({'id': dep['user_id']}, {'_id': 0, 'phone': 1})
        result.append({
            **dep,
            'user_phone': user['phone'] if user else 'Unknown'
        })
    
    return {'deposits': result}

@api_router.post("/admin/deposits/approve")
async def approve_deposit(data: ApprovalRequest, admin: User = Depends(get_admin_user)):
    deposit = await db.deposits.find_one({'id': data.transaction_id}, {'_id': 0})
    
    if not deposit:
        raise HTTPException(status_code=404, detail='Deposit not found')
    
    if data.approved:
        # Add to user balance
        await db.users.update_one(
            {'id': deposit['user_id']},
            {'$inc': {'balance': deposit['amount']}}
        )
        
        # Check if first deposit for referral bonus
        user = await db.users.find_one({'id': deposit['user_id']}, {'_id': 0})
        if user.get('referred_by') and deposit['amount'] >= 30:
            # Check if this is first approved deposit
            approved_count = await db.deposits.count_documents({
                'user_id': deposit['user_id'],
                'status': 'approved'
            })
            
            if approved_count == 0:
                # Give referral bonus
                referrer = await db.users.find_one({'referral_code': user['referred_by']}, {'_id': 0})
                if referrer:
                    await db.users.update_one(
                        {'id': referrer['id']},
                        {'$inc': {'balance': 10.0}}
                    )
        
        await db.deposits.update_one(
            {'id': data.transaction_id},
            {'$set': {'status': 'approved', 'updated_at': datetime.now(timezone.utc).isoformat()}}
        )
    else:
        await db.deposits.update_one(
            {'id': data.transaction_id},
            {'$set': {'status': 'rejected', 'updated_at': datetime.now(timezone.utc).isoformat()}}
        )
    
    return {'message': 'Deposit processed'}

@api_router.get("/admin/withdrawals/pending")
async def get_pending_withdrawals(admin: User = Depends(get_admin_user)):
    withdrawals = await db.withdrawals.find({'status': 'pending'}, {'_id': 0}).sort('created_at', -1).to_list(100)
    
    # Get user info
    result = []
    for wd in withdrawals:
        user = await db.users.find_one({'id': wd['user_id']}, {'_id': 0, 'phone': 1})
        result.append({
            **wd,
            'user_phone': user['phone'] if user else 'Unknown'
        })
    
    return {'withdrawals': result}

@api_router.post("/admin/withdrawals/approve")
async def approve_withdrawal(data: ApprovalRequest, admin: User = Depends(get_admin_user)):
    withdrawal = await db.withdrawals.find_one({'id': data.transaction_id}, {'_id': 0})
    
    if not withdrawal:
        raise HTTPException(status_code=404, detail='Withdrawal not found')
    
    if not data.approved:
        # Return money to user
        await db.users.update_one(
            {'id': withdrawal['user_id']},
            {'$inc': {'balance': withdrawal['amount']}}
        )
    
    status = 'approved' if data.approved else 'rejected'
    await db.withdrawals.update_one(
        {'id': data.transaction_id},
        {'$set': {'status': status, 'updated_at': datetime.now(timezone.utc).isoformat()}}
    )
    
    return {'message': 'Withdrawal processed'}

@api_router.get("/admin/stats")
async def get_admin_stats(admin: User = Depends(get_admin_user)):
    total_users = await db.users.count_documents({})
    total_deposits = await db.deposits.count_documents({'status': 'approved'})
    total_withdrawals = await db.withdrawals.count_documents({'status': 'approved'})
    pending_deposits = await db.deposits.count_documents({'status': 'pending'})
    pending_withdrawals = await db.withdrawals.count_documents({'status': 'pending'})
    
    # Calculate totals
    deposits_pipeline = [
        {'$match': {'status': 'approved'}},
        {'$group': {'_id': None, 'total': {'$sum': '$amount'}}}
    ]
    deposits_total = await db.deposits.aggregate(deposits_pipeline).to_list(1)
    
    withdrawals_pipeline = [
        {'$match': {'status': 'approved'}},
        {'$group': {'_id': None, 'total': {'$sum': '$amount'}}}
    ]
    withdrawals_total = await db.withdrawals.aggregate(withdrawals_pipeline).to_list(1)
    
    return {
        'total_users': total_users,
        'total_deposits': total_deposits,
        'total_withdrawals': total_withdrawals,
        'pending_deposits': pending_deposits,
        'pending_withdrawals': pending_withdrawals,
        'total_deposits_amount': deposits_total[0]['total'] if deposits_total else 0,
        'total_withdrawals_amount': withdrawals_total[0]['total'] if withdrawals_total else 0
    }

@api_router.get("/admin/users")
async def get_all_users(admin: User = Depends(get_admin_user)):
    users = await db.users.find({}, {'_id': 0, 'password': 0}).to_list(1000)
    return {'users': users}

@api_router.get("/config/pix")
async def get_pix_config():
    return {
        'pix_code': '00020101021126580014br.gov.bcb.pix0136223ed24f-4b1a-46fe-993c-10e16a2fb7935204000053039865802BR5918GABRIEL G DA CUNHA6006ESTEIO62070503***630454FB',
        'recipient_name': 'GABRIEL G DA CUNHA'
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()