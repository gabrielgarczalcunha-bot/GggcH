import { useState, useEffect } from 'react';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import { Copy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Deposits({ user, onLogout }) {
  const [amount, setAmount] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [pixConfig, setPixConfig] = useState({ pix_code: '', recipient_name: '' });
  const [loading, setLoading] = useState(false);
  const [showPixCode, setShowPixCode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeposits();
    fetchPixConfig();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await api.get('/deposits/my-deposits');
      setDeposits(res.data.deposits);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    }
  };

  const fetchPixConfig = async () => {
    try {
      const res = await api.get('/config/pix');
      setPixConfig(res.data);
    } catch (error) {
      console.error('Error fetching PIX config:', error);
    }
  };

  const handleShowPixCode = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Digite um valor válido');
      return;
    }
    setShowPixCode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/deposits/request', {
        amount: parseFloat(amount),
        proof_image_url: proofUrl
      });
      toast.success('Solicitação de depósito enviada!');
      setAmount('');
      setProofUrl('');
      setShowPixCode(false);
      fetchDeposits();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao enviar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return 'Pendente';
    }
  };

  if (showPixCode) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
          <button onClick={() => setShowPixCode(false)} className="mb-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Depositar R$ {parseFloat(amount).toFixed(2)}</h1>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6" data-testid="pix-code-view">
          {/* QR Code */}
          <Card className="mb-6 border-2 border-green-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <img 
                  src="https://static.prod-images.emergentagent.com/jobs/c828b448-09dd-4e01-9208-f245ab52da70/images/78040df5fe1f9b1a387d31518605b852d5bb766f4e1a14c0ee2385f4c653dbf3.png"
                  alt="QR Code PIX"
                  className="w-64 h-64 border-4 border-gray-200 rounded-xl"
                />
              </div>
              <p className="text-center text-gray-600 text-sm">Escaneie o QR Code com o app do seu banco</p>
            </CardContent>
          </Card>

          {/* PIX Code */}
          <Card className="mb-6 border-2 border-green-200 shadow-lg" data-testid="pix-code-card">
            <CardHeader>
              <CardTitle className="text-green-900 text-center">Código PIX Copia e Cola</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded-lg mb-4 break-all font-mono text-xs">
                {pixConfig.pix_code}
              </div>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(pixConfig.pix_code);
                  toast.success('Código PIX copiado!');
                }}
                className="w-full bg-green-600 hover:bg-green-700 h-12 font-semibold"
                data-testid="copy-pix-btn"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copiar Código
              </Button>
            </CardContent>
          </Card>

          {/* Submit Proof */}
          <Card className="mb-6 border-2 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-900">Enviar Comprovante</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="proof" className="text-gray-700">Link do Comprovante</Label>
                  <Input
                    id="proof"
                    data-testid="proof-input"
                    type="url"
                    placeholder="Cole o link da imagem do comprovante"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    required
                    className="border-green-300"
                  />
                  <p className="text-xs text-gray-500">Upload em: imgur.com, imgbb.com, etc</p>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 h-12 font-bold"
                  data-testid="submit-deposit-btn"
                >
                  {loading ? 'Enviando...' : 'Enviar Comprovante'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
        <button onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold">Recarga</h1>
        <p className="text-green-100 mt-1">Adicione saldo para investir</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6" data-testid="deposits-container">
        
        {/* Deposit Amount Card */}
        <Card className="mb-6 border-2 border-green-200 shadow-lg" data-testid="deposit-form-card">
          <CardHeader>
            <CardTitle className="text-green-900">Quanto deseja depositar?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-700 text-lg">Valor (R$)</Label>
                <Input
                  id="amount"
                  data-testid="amount-input"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-green-300 text-2xl h-16 text-center font-bold"
                />
              </div>
              <Button
                onClick={handleShowPixCode}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 h-14 font-bold text-lg"
                data-testid="continue-deposit-btn"
              >
                Continuar com PIX
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Deposits History */}
        <Card className="border-2 border-green-200 shadow-lg" data-testid="deposits-history-card">
          <CardHeader>
            <CardTitle className="text-green-900">Histórico de Depósitos</CardTitle>
          </CardHeader>
          <CardContent>
            {deposits.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum depósito ainda</p>
            ) : (
              <div className="space-y-3">
                {deposits.map((deposit) => (
                  <div key={deposit.id} className="border border-green-200 rounded-xl p-4 bg-white" data-testid={`deposit-${deposit.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-2xl font-bold text-green-900">R$ {deposit.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{new Date(deposit.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`} data-testid={`deposit-status-${deposit.id}`}>
                        {getStatusText(deposit.status)}
                      </span>
                    </div>
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
