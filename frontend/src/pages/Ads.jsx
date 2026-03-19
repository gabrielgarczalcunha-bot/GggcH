import { useState, useEffect, useRef } from 'react';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Play, CheckCircle, Clock, Gift, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Google AdMob Configuration
const ADMOB_APP_ID = 'ca-app-pub-6948013848395039~2009538747';
const ADMOB_AD_UNIT_ID = 'ca-app-pub-6948013848395039/3202737894';

export default function Ads({ user, onLogout }) {
  const [adStats, setAdStats] = useState({ ads_watched_today: 0, remaining: 10, can_watch: true });
  const [isWatching, setIsWatching] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const adContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, []);

  useEffect(() => {
    let interval;
    if (isWatching && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanClaim(true);
            setAdLoaded(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWatching, timer]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/ads/check-limit');
      setAdStats(res.data);
    } catch (error) {
      console.error('Error fetching ad stats:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ads/history');
      setHistory(res.data.ads);
    } catch (error) {
      console.error('Error fetching ad history:', error);
    }
  };

  const handleStartAd = () => {
    if (!adStats.can_watch) {
      toast.error('Limite diário atingido!');
      return;
    }
    
    setIsWatching(true);
    setTimer(30);
    setCanClaim(false);
    setAdLoaded(false);
    
    // Simulate ad loading
    toast.info('Carregando anúncio...');
  };

  const handleClaimReward = async () => {
    if (!canClaim) {
      toast.error('Aguarde o anúncio carregar completamente');
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/ads/complete');
      toast.success(`Você ganhou R$ ${res.data.reward.toFixed(2)}!`);
      setIsWatching(false);
      setCanClaim(false);
      setAdLoaded(false);
      setTimer(0);
      fetchStats();
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao registrar anúncio');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAd = () => {
    setIsWatching(false);
    setTimer(0);
    setCanClaim(false);
    setAdLoaded(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
        <button onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold">Assistir Anúncios</h1>
        <p className="text-green-100 mt-1">Ganhe R$ 0,25 por anúncio assistido!</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6" data-testid="ads-container">
        
        {/* Stats Card */}
        <Card className="mb-6 border-2 border-green-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">{adStats.ads_watched_today}</div>
                <div className="text-sm text-gray-600">Assistidos Hoje</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600">{adStats.remaining}</div>
                <div className="text-sm text-gray-600">Restantes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">R$ 0,25</div>
                <div className="text-sm text-gray-600">Por Anúncio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Viewer */}
        {!isWatching ? (
          <Card className="mb-6 border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Play className="h-6 w-6" />
                Assistir Anúncio
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {adStats.can_watch ? (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">📺</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Pronto para ganhar?</h3>
                    <p className="text-gray-600">
                      Assista um anúncio de 30 segundos e ganhe R$ 0,25 na sua conta!
                    </p>
                  </div>
                  <Button
                    onClick={handleStartAd}
                    className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 h-14 px-12 text-lg font-bold"
                    data-testid="start-ad-btn"
                  >
                    <Play className="mr-2 h-6 w-6" />
                    Iniciar Anúncio
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Limite Diário Atingido!</h3>
                  <p className="text-gray-600">
                    Você já assistiu 10 anúncios hoje. Volte amanhã para ganhar mais!
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    Novo limite disponível às 00:00
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-2 border-yellow-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Tv className="h-6 w-6" />
                  Assistindo Anúncio
                </span>
                {timer > 0 && (
                  <span className="text-2xl font-bold bg-white/20 px-3 py-1 rounded-full">{timer}s</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Ad Display Area */}
              <div 
                ref={adContainerRef}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 mb-4 min-h-[280px] flex flex-col items-center justify-center relative overflow-hidden"
                data-testid="ad-display-area"
              >
                {/* Animated background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-400 rounded-full blur-3xl animate-pulse delay-150"></div>
                </div>
                
                {/* Ad content simulation */}
                <div className="relative z-10 text-center">
                  {timer > 0 ? (
                    <>
                      <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white text-lg font-semibold mb-2">Anúncio em exibição</p>
                      <p className="text-gray-400 text-sm">Aguarde {timer} segundos...</p>
                      
                      {/* Progress bar */}
                      <div className="mt-4 w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-green-400 transition-all duration-1000"
                          style={{ width: `${((30 - timer) / 30) * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* AdMob info */}
                      <div className="mt-4 px-4 py-2 bg-white/10 rounded-lg">
                        <p className="text-xs text-gray-400">Powered by Google AdMob</p>
                        <p className="text-xs text-gray-500 mt-1">ID: {ADMOB_AD_UNIT_ID.slice(0, 20)}...</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">🎉</div>
                      <p className="text-white text-xl font-bold mb-2">Anúncio Completo!</p>
                      <p className="text-green-400 text-lg">Você pode resgatar sua recompensa</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleClaimReward}
                  disabled={!canClaim || loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-14 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="claim-reward-btn"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processando...
                    </span>
                  ) : canClaim ? (
                    <>
                      <Gift className="mr-2 h-6 w-6" />
                      Resgatar R$ 0,25
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-6 w-6" />
                      Aguarde {timer}s
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancelAd}
                  variant="outline"
                  className="h-14 px-6 border-2 border-gray-300 hover:bg-gray-100"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card className="mb-6 border-2 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <span className="text-2xl">💡</span> Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">1</div>
                <div>
                  <p className="font-semibold text-gray-800">Clique em "Iniciar Anúncio"</p>
                  <p className="text-sm text-gray-600">O anúncio será carregado automaticamente</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">2</div>
                <div>
                  <p className="font-semibold text-gray-800">Aguarde 30 segundos</p>
                  <p className="text-sm text-gray-600">O tempo mínimo para validar o anúncio</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-emerald-50 rounded-lg">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">3</div>
                <div>
                  <p className="font-semibold text-gray-800">Resgate sua recompensa</p>
                  <p className="text-sm text-gray-600">R$ 0,25 será creditado na sua conta</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900 font-medium">
                <span className="text-lg">⚠️</span> <strong>Limite:</strong> 10 anúncios por dia • Recompensa total: R$ 2,50/dia
              </p>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <Card className="border-2 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Histórico de Anúncios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8">
                <Tv className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum anúncio assistido ainda</p>
                <p className="text-sm text-gray-400 mt-1">Assista seu primeiro anúncio para ganhar R$ 0,25!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {history.slice(0, 10).map((ad) => (
                  <div key={ad.id} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Anúncio assistido</p>
                        <p className="text-xs text-gray-500">
                          {new Date(ad.viewed_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-green-600 font-bold text-lg">+R$ {ad.reward.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
