import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Wallet, TrendingUp, Users, ShoppingBag, DollarSign, LogOut, User as UserIcon, Shield, Tv } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [balance, setBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [lots, setLots] = useState([]);
  const [lotPrices, setLotPrices] = useState([]);
  const [lotCounts, setLotCounts] = useState({});
  const [referralStats, setReferralStats] = useState({ total_referrals: 0, total_earnings: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, lotsRes, pricesRes, refRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/lots/my-lots'),
        api.get('/lots/prices'),
        api.get('/referrals/stats')
      ]);
      
      // Count active lots by type
      const activeLots = lotsRes.data.lots.filter(l => l.status === 'active');
      const counts = {};
      activeLots.forEach(lot => {
        counts[lot.lot_type] = (counts[lot.lot_type] || 0) + 1;
      });
      
      setBalance(userRes.data.balance);
      setTotalEarnings(userRes.data.total_earnings);
      setLots(lotsRes.data.lots);
      setLotPrices(pricesRes.data.lots);
      setReferralStats(refRes.data);
      setLotCounts(counts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePurchaseLot = async (lotType) => {
    setLoading(true);
    try {
      await api.post('/lots/purchase', { lot_type: lotType });
      toast.success('Lote comprado com sucesso!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao comprar lote');
    } finally {
      setLoading(false);
    }
  };

  const activeLots = lots.filter(l => l.status === 'active');
  const totalInvested = activeLots.reduce((sum, l) => sum + l.invested_amount, 0);
  const totalCurrentEarnings = activeLots.reduce((sum, l) => sum + l.current_earnings, 0);

  const referralLink = `${window.location.origin}/register/${referralStats.referral_code}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Header with Background */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.85), rgba(6, 78, 59, 0.85)), url('https://static.prod-images.emergentagent.com/jobs/c828b448-09dd-4e01-9208-f245ab52da70/images/2bb0237451801a9200f64aec0490e213f0ad235e63cc04bcc1bd2727fc1d3c7d.png')`
        }}
      >
        {/* Logo and Menu */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Wealth Farm</h1>
          </div>
          <div className="flex gap-3">
            {user?.is_admin && (
              <button
                onClick={() => navigate('/admin')}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                data-testid="nav-admin-top"
              >
                <Shield className="h-5 w-5 text-white" />
              </button>
            )}
            <button
              onClick={() => navigate('/profile')}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30"
              data-testid="nav-profile-top"
            >
              <UserIcon className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30"
              data-testid="logout-top"
            >
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Balance Display */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="text-white">
            <p className="text-sm opacity-90 mb-1">Saldo Disponível</p>
            <h2 className="text-5xl font-bold text-yellow-400">R$ {balance.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-6" data-testid="dashboard-container">
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate('/deposits')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-3"
            data-testid="deposits-nav-btn"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <img 
                src="https://static.prod-images.emergentagent.com/jobs/c828b448-09dd-4e01-9208-f245ab52da70/images/2132c09d2ead36dccbd4545fc18ec9709c58b1d4e11c8a875fa87c83f701f67f.png" 
                alt="Recharge" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="font-semibold text-gray-800">Recarga</span>
          </button>

          <button
            onClick={() => navigate('/withdrawals')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-3"
            data-testid="withdrawals-nav-btn"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Saque</span>
          </button>
        </div>

        {/* Watch Ads Banner */}
        <button
          onClick={() => navigate('/ads')}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-2xl p-5 mb-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
          data-testid="ads-banner-btn"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Tv className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-lg">Assistir Anúncios</h3>
                <p className="text-white/80 text-sm">Ganhe R$ 0,25 por anúncio!</p>
              </div>
            </div>
            <div className="bg-white text-purple-600 px-4 py-2 rounded-full font-bold text-sm">
              Até R$ 2,50/dia
            </div>
          </div>
        </button>

        {/* Referral Bonus Banner */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-4 border-green-600 rounded-3xl p-6 mb-6 shadow-lg" data-testid="referral-card">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="https://static.prod-images.emergentagent.com/jobs/c828b448-09dd-4e01-9208-f245ab52da70/images/2132c09d2ead36dccbd4545fc18ec9709c58b1d4e11c8a875fa87c83f701f67f.png" 
                  alt="Bonus" 
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h3 className="text-3xl font-bold text-red-600 mb-1">R$ 10,00</h3>
                  <p className="text-sm text-gray-700 font-medium">
                    Indique amigos e ganhe R$ 10 no<br/>primeiro depósito de R$ 30!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Share Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  const message = `🌾 Wealth Farm - Invista no Agronegócio!\n\nGanhe rendimentos investindo no campo! 💰\n\n${referralLink}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                data-testid="share-whatsapp-btn"
              >
                <span>📱</span> WhatsApp
              </button>
              
              <button
                onClick={() => {
                  const message = `🌾 Wealth Farm - Invista no Agronegócio!\n\nGanhe rendimentos investindo no campo! 💰\n\n${referralLink}`;
                  window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                data-testid="share-telegram-btn"
              >
                <span>✈️</span> Telegram
              </button>
              
              <button
                onClick={() => {
                  const subject = 'Convite Wealth Farm - Invista e Ganhe!';
                  const body = `Olá!\n\nConheça a Wealth Farm - plataforma de investimentos no agronegócio brasileiro!\n\n🌾 3 pacotes de investimento\n💰 Rendimento por hora\n📈 Sistema de indicação\n💵 Saques via PIX\n\nCadastre-se agora:\n${referralLink}\n\nAproveite!`;
                  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                data-testid="share-email-btn"
              >
                <span>📧</span> Email
              </button>
              
              <button
                onClick={() => {
                  const message = `Wealth Farm - Invista e ganhe! ${referralLink}`;
                  window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                data-testid="share-sms-btn"
              >
                <span>💬</span> SMS
              </button>
            </div>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                toast.success('Link copiado!');
              }}
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold"
              data-testid="copy-referral-btn"
            >
              📋 Copiar Link
            </button>
          </div>
        </div>

        {/* Stats Cards - Income and Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Pending Income Card */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 shadow-lg text-white" data-testid="earnings-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium opacity-90">Rendimentos Pendentes</h3>
                <p className="text-3xl font-bold text-yellow-300 mt-2">+R$ {totalCurrentEarnings.toFixed(2)}</p>
              </div>
              <img 
                src="https://static.prod-images.emergentagent.com/jobs/c828b448-09dd-4e01-9208-f245ab52da70/images/ac20397c9d885ef8fa9805deaf50f03e41e457620f3132c0357a8fe11e7b58bf.png" 
                alt="Growth" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <button
              onClick={() => navigate('/my-lots')}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-semibold w-full"
              data-testid="receive-earnings-btn"
            >
              Retirar
            </button>
          </div>

          {/* Total Invested Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-6 shadow-lg text-white" data-testid="invested-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium opacity-90">Total Investido</h3>
                <p className="text-3xl font-bold text-yellow-300 mt-2">R$ {totalInvested.toFixed(2)}</p>
                <p className="text-sm opacity-80 mt-1">{activeLots.length} lotes ativos</p>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl">
                <TrendingUp className="w-12 h-12" />
              </div>
            </div>
            <button
              onClick={() => navigate('/my-lots')}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-semibold w-full"
              data-testid="view-lots-btn"
            >
              Ver Meus Lotes
            </button>
          </div>
        </div>

        {/* Investment Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2">Pacotes de Investimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lotPrices.map((lot) => {
              const userActiveLots = lotCounts[lot.type] || 0;
              const canPurchase = balance >= lot.price && userActiveLots < 2;
              const buttonText = userActiveLots >= 2 
                ? 'Limite Atingido (2/2)' 
                : balance < lot.price 
                  ? 'Saldo Insuficiente' 
                  : 'Comprar Agora';
              
              return (
                <Card key={lot.type} className="border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all overflow-hidden" data-testid={`lot-${lot.type}-card`}>
                  <CardHeader className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{lot.name}</CardTitle>
                      <img src={lot.image} alt={lot.name} className="w-16 h-16 object-contain" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4 bg-gradient-to-b from-green-50 to-white">
                    {userActiveLots > 0 && (
                      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 text-center">
                        <p className="font-semibold text-yellow-900">
                          Você possui {userActiveLots}/2 lotes ativos
                        </p>
                      </div>
                    )}
                    <div className="text-center py-4 bg-white rounded-2xl shadow-inner">
                      <div className="text-4xl font-bold text-green-700">R$ {lot.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-600 mt-1">Investimento</div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-gray-700">Rendimento/hora:</span>
                        <span className="font-bold text-green-700">R$ {lot.hourly_rate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Duração:</span>
                        <span className="font-bold text-green-700">{lot.duration_days} dias</span>
                      </div>
                      <div className="flex justify-between p-3 bg-emerald-50 rounded-lg">
                        <span className="text-gray-700">Retorno total:</span>
                        <span className="font-bold text-green-700">R$ {lot.total_return.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg border-2 border-yellow-300">
                        <span className="text-gray-800 font-semibold">💰 Lucro:</span>
                        <span className="font-bold text-green-600 text-lg">R$ {(lot.total_return - lot.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePurchaseLot(lot.type)}
                      disabled={loading || !canPurchase}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 h-14 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid={`purchase-lot-${lot.type}-btn`}
                    >
                      {buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="grid grid-cols-5 gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex flex-col items-center gap-1 text-green-600"
                data-testid="nav-home-bottom"
              >
                <div className="p-2 bg-green-100 rounded-full">
                  <Wallet className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Início</span>
              </button>
              <button
                onClick={() => navigate('/deposits')}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
                data-testid="nav-deposits-bottom"
              >
                <DollarSign className="h-6 w-6" />
                <span className="text-xs">Recarga</span>
              </button>
              <button
                onClick={() => navigate('/my-lots')}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
                data-testid="nav-lots-bottom"
              >
                <ShoppingBag className="h-6 w-6" />
                <span className="text-xs">Lotes</span>
              </button>
              <button
                onClick={() => navigate('/withdrawals')}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
                data-testid="nav-withdrawals-bottom"
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-xs">Saque</span>
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
                data-testid="nav-profile-bottom"
              >
                <UserIcon className="h-6 w-6" />
                <span className="text-xs">Perfil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Spacing for bottom nav */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
