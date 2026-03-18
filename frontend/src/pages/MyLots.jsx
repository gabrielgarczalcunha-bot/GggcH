import { useState, useEffect } from 'react';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';

export default function MyLots({ user, onLogout }) {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLots();
    const interval = setInterval(fetchLots, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchLots = async () => {
    try {
      const res = await api.get('/lots/my-lots');
      setLots(res.data.lots);
    } catch (error) {
      console.error('Error fetching lots:', error);
    }
  };

  const handleWithdrawEarnings = async (lotId) => {
    setLoading(true);
    try {
      await api.post(`/lots/${lotId}/withdraw-earnings`);
      toast.success('Rendimentos transferidos para seu saldo!');
      fetchLots();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao retirar rendimentos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'withdrawn': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'completed': return 'Completo';
      case 'withdrawn': return 'Retirado';
      default: return status;
    }
  };

  const activeLots = lots.filter(l => l.status === 'active');
  const otherLots = lots.filter(l => l.status !== 'active');
  const totalEarnings = lots.reduce((sum, l) => sum + l.current_earnings, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <Navigation user={user} onLogout={onLogout} />
      
      <div className="max-w-6xl mx-auto px-4 py-8" data-testid="my-lots-container">
        <h1 className="text-4xl font-bold text-emerald-900 mb-8">Meus Lotes</h1>

        {/* Summary Card */}
        <Card className="mb-8 border-emerald-200 shadow-lg" data-testid="lots-summary-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-emerald-700 mb-2">Lotes Ativos</p>
                <p className="text-4xl font-bold text-emerald-900">{activeLots.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-emerald-700 mb-2">Total de Lotes</p>
                <p className="text-4xl font-bold text-emerald-900">{lots.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-emerald-700 mb-2">Rendimentos Acumulados</p>
                <p className="text-4xl font-bold text-emerald-900">R$ {totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Lots */}
        {activeLots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">Lotes Ativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeLots.map((lot) => {
                const progress = (lot.hours_elapsed / lot.total_hours) * 100;
                const hoursRemaining = lot.total_hours - lot.hours_elapsed;
                const daysRemaining = Math.floor(hoursRemaining / 24);
                const hoursRemainingMod = hoursRemaining % 24;

                return (
                  <Card key={lot.id} className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow" data-testid={`lot-${lot.id}`}>
                    <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Lote {lot.lot_type}</CardTitle>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lot.status)}`}>
                          {getStatusText(lot.status)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-700">Investido:</span>
                          <span className="font-semibold text-emerald-900">R$ {lot.invested_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-700">Rendimento/hora:</span>
                          <span className="font-semibold text-emerald-900">R$ {lot.hourly_rate.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-700">Rendimento atual:</span>
                          <span className="font-bold text-emerald-600 text-lg">R$ {lot.current_earnings.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Progresso
                          </span>
                          <span className="font-semibold text-emerald-900">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-emerald-600">
                          {daysRemaining}d {hoursRemainingMod}h restantes de 30 dias
                        </p>
                      </div>

                      <div className="text-xs text-emerald-600">
                        <p>Iniciado em: {new Date(lot.purchased_at).toLocaleString('pt-BR')}</p>
                      </div>

                      <Button
                        onClick={() => handleWithdrawEarnings(lot.id)}
                        disabled={loading || lot.current_earnings <= 0}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 font-semibold"
                        data-testid={`withdraw-earnings-${lot.id}-btn`}
                      >
                        <DollarSign className="mr-2 h-5 w-5" />
                        Retirar Rendimentos
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Lots */}
        {otherLots.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">Histórico</h2>
            <div className="space-y-4">
              {otherLots.map((lot) => (
                <Card key={lot.id} className="border-emerald-200 shadow-md" data-testid={`lot-history-${lot.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-emerald-900">Lote {lot.lot_type}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lot.status)}`}>
                            {getStatusText(lot.status)}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="text-emerald-700">Investido: <span className="font-semibold text-emerald-900">R$ {lot.invested_amount.toFixed(2)}</span></p>
                          <p className="text-emerald-700">Rendimentos finais: <span className="font-semibold text-emerald-900">R$ {lot.current_earnings.toFixed(2)}</span></p>
                          <p className="text-xs text-emerald-600">Iniciado em: {new Date(lot.purchased_at).toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {lots.length === 0 && (
          <Card className="border-emerald-200 shadow-lg">
            <CardContent className="py-12">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">Nenhum lote ainda</h3>
                <p className="text-emerald-700 mb-6">Compre seu primeiro lote e comece a ganhar!</p>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  Ver Pacotes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
