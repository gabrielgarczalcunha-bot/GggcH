import { useState, useEffect } from 'react';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { Upload, Copy, QrCode } from 'lucide-react';

export default function Deposits({ user, onLogout }) {
  const [amount, setAmount] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [pixConfig, setPixConfig] = useState({ pix_code: '', recipient_name: '' });
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <Navigation user={user} onLogout={onLogout} />
      
      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="deposits-container">
        <h1 className="text-4xl font-bold text-emerald-900 mb-8">Depósitos</h1>

        {/* PIX Instructions */}
        <Card className="mb-8 border-emerald-200 shadow-lg" data-testid="pix-instructions-card">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-6 w-6" />
              Instruções para Depósito via PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label className="text-emerald-900 font-semibold">1. Copie o código PIX abaixo:</Label>
              <div className="flex gap-2 mt-2">
                <Input 
                  value={pixConfig.pix_code} 
                  readOnly 
                  className="flex-1 border-emerald-300 bg-emerald-50 font-mono text-xs"
                  data-testid="pix-code-input"
                />
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(pixConfig.pix_code);
                    toast.success('Código PIX copiado!');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  data-testid="copy-pix-btn"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-emerald-700 mt-2">Destinatário: <span className="font-semibold">{pixConfig.recipient_name}</span></p>
            </div>
            <div className="text-sm text-emerald-700 space-y-2">
              <p><strong>2.</strong> Faça o pagamento via PIX no app do seu banco</p>
              <p><strong>3.</strong> Tire um print/screenshot do comprovante</p>
              <p><strong>4.</strong> Cole o link do comprovante abaixo e envie</p>
              <p><strong>5.</strong> Aguarde a aprovação do administrador</p>
            </div>
          </CardContent>
        </Card>

        {/* Deposit Request Form */}
        <Card className="mb-8 border-emerald-200 shadow-lg" data-testid="deposit-form-card">
          <CardHeader>
            <CardTitle className="text-emerald-900">Solicitar Depósito</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-emerald-900">Valor (R$)</Label>
                <Input
                  id="amount"
                  data-testid="amount-input"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="border-emerald-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proof" className="text-emerald-900">Link do Comprovante</Label>
                <Input
                  id="proof"
                  data-testid="proof-input"
                  type="url"
                  placeholder="https://..."
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  required
                  className="border-emerald-300"
                />
                <p className="text-xs text-emerald-600">Cole o link da imagem do comprovante (ex: imgur, imgbb, etc)</p>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 font-semibold"
                data-testid="submit-deposit-btn"
              >
                <Upload className="mr-2 h-5 w-5" />
                {loading ? 'Enviando...' : 'Enviar Solicitação'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Deposits History */}
        <Card className="border-emerald-200 shadow-lg" data-testid="deposits-history-card">
          <CardHeader>
            <CardTitle className="text-emerald-900">Histórico de Depósitos</CardTitle>
          </CardHeader>
          <CardContent>
            {deposits.length === 0 ? (
              <p className="text-center text-emerald-700 py-8">Nenhum depósito ainda</p>
            ) : (
              <div className="space-y-4">
                {deposits.map((deposit) => (
                  <div key={deposit.id} className="border border-emerald-200 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`deposit-${deposit.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-2xl font-bold text-emerald-900">R$ {deposit.amount.toFixed(2)}</p>
                        <p className="text-xs text-emerald-600">{new Date(deposit.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deposit.status)}`} data-testid={`deposit-status-${deposit.id}`}>
                        {getStatusText(deposit.status)}
                      </span>
                    </div>
                    <a 
                      href={deposit.proof_image_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      Ver comprovante
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
