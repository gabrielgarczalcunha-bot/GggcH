import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Wallet, TrendingUp, Users, ShoppingBag, Menu, X, Home, Package, DollarSign, LogOut, User as UserIcon, Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function Dashboard({ user, onLogout }) {
  const [balance, setBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [lots, setLots] = useState([]);
  const [lotPrices, setLotPrices] = useState([]);
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
      setBalance(userRes.data.balance);
      setTotalEarnings(userRes.data.total_earnings);
      setLots(lotsRes.data.lots);
      setLotPrices(pricesRes.data.lots);
      setReferralStats(refRes.data);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <Navigation user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8" data-testid="dashboard-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-900 mb-2">Bem-vindo ao Wealth Farm</h1>
          <p className="text-lg text-emerald-700">Gerencie seus investimentos e acompanhe seus ganhos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow" data-testid="balance-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Saldo Disponível</CardTitle>
              <Wallet className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">R$ {balance.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow" data-testid="invested-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Total Investido</CardTitle>
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">R$ {totalInvested.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow" data-testid="earnings-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Rendimentos Ativos</CardTitle>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">R$ {totalCurrentEarnings.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow" data-testid="referrals-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Indicações</CardTitle>
              <Users className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{referralStats.total_referrals}</div>
              <p className="text-xs text-emerald-600 mt-1">R$ {referralStats.total_earnings.toFixed(2)} ganhos</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="mb-8 border-emerald-200 shadow-lg" data-testid="referral-card">
          <CardHeader>
            <CardTitle className="text-emerald-900">Seu Link de Indicação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-700 mb-3">
              Convide amigos e ganhe R$ 10,00 quando eles fizerem o primeiro depósito de R$ 30,00 ou mais!
            </p>
            <div className="flex gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="flex-1 border-emerald-300 bg-emerald-50"
                data-testid="referral-link-input"
              />
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  toast.success('Link copiado!');
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
                data-testid="copy-referral-btn"
              >
                Copiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Investment Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">Pacotes de Investimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lotPrices.map((lot) => (
              <Card key={lot.type} className="border-emerald-200 shadow-lg hover:shadow-xl transition-all" data-testid={`lot-${lot.type}-card`}>
                <CardHeader className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">Lote {lot.type}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-900">R$ {lot.price.toFixed(2)}</div>
                    <div className="text-sm text-emerald-600 mt-2">Investimento</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Rendimento/hora:</span>
                      <span className="font-semibold text-emerald-900">R$ {lot.hourly_rate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Duração:</span>
                      <span className="font-semibold text-emerald-900">{lot.duration_days} dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Retorno total:</span>
                      <span className="font-semibold text-emerald-900">R$ {lot.total_return.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-emerald-200 pt-2">
                      <span className="text-emerald-700 font-medium">Lucro:</span>
                      <span className="font-bold text-emerald-600">R$ {(lot.total_return - lot.price).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePurchaseLot(lot.type)}
                    disabled={loading || balance < lot.price}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 font-semibold"
                    data-testid={`purchase-lot-${lot.type}-btn`}
                  >
                    {balance < lot.price ? 'Saldo Insuficiente' : 'Comprar Lote'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            onClick={() => navigate('/deposits')}
            className="h-20 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-lg"
            data-testid="deposits-nav-btn"
          >
            <DollarSign className="mr-2 h-6 w-6" />
            Fazer Depósito
          </Button>
          <Button
            onClick={() => navigate('/my-lots')}
            className="h-20 text-lg bg-teal-600 hover:bg-teal-700 shadow-lg"
            data-testid="my-lots-nav-btn"
          >
            <Package className="mr-2 h-6 w-6" />
            Meus Lotes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Import Input
import { Input } from '@/components/ui/input';