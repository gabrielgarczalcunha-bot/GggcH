import { useState, useEffect } from 'react';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { Banknote, AlertCircle } from 'lucide-react';

export default function Withdrawals({ user, onLogout }) {
  const [amount, setAmount] = useState('');
  const [pixKeyType, setPixKeyType] = useState('cpf');
  const [pixKey, setPixKey] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
    fetchBalance();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/withdrawals/my-withdrawals');
      setWithdrawals(res.data.withdrawals);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await api.get('/auth/me');
      setBalance(res.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount < 45) {
      toast.error('Valor mínimo de saque é R$ 45,00');
      return;
    }

    if (withdrawAmount > balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    setLoading(true);

    try {
      await api.post('/withdrawals/request', {
        amount: withdrawAmount,
        pix_key_type: pixKeyType,
        pix_key: pixKey
      });
      toast.success('Solicitação de saque enviada!');
      setAmount('');
      setPixKey('');
      fetchWithdrawals();
      fetchBalance();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao solicitar saque');
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = (amount) => {
    const value = parseFloat(amount) || 0;
    return value * 0.10;
  };

  const calculateNet = (amount) => {
    const value = parseFloat(amount) || 0;
    return value - (value * 0.10);
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
      
      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="withdrawals-container">
        <h1 className="text-4xl font-bold text-emerald-900 mb-8">Saques</h1>

        {/* Balance Card */}
        <Card className="mb-8 border-emerald-200 shadow-lg" data-testid="balance-info-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-emerald-700 mb-2">Saldo Disponível</p>
              <p className="text-4xl font-bold text-emerald-900">R$ {balance.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="mb-8 border-emerald-200 shadow-lg" data-testid="withdrawal-form-card">
          <CardHeader>
            <CardTitle className="text-emerald-900">Solicitar Saque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Informações importantes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Valor mínimo de saque: R$ 45,00</li>
                  <li>Taxa de processamento: 10%</li>
                  <li>Aprovação manual pelo administrador</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-emerald-900">Valor do Saque (R$)</Label>
                <Input
                  id="amount"
                  data-testid="amount-input"
                  type="number"
                  step="0.01"
                  min="45"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="border-emerald-300"
                />
              </div>

              {amount && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Valor solicitado:</span>
                    <span className="font-semibold text-emerald-900">R$ {parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Taxa (10%):</span>
                    <span className="font-semibold text-red-600">- R$ {calculateFee(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-300 pt-2">
                    <span className="text-emerald-700 font-medium">Você receberá:</span>
                    <span className="font-bold text-emerald-900">R$ {calculateNet(amount).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="pixKeyType" className="text-emerald-900">Tipo de Chave PIX</Label>
                <Select value={pixKeyType} onValueChange={setPixKeyType}>
                  <SelectTrigger className="border-emerald-300" data-testid="pix-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="phone">Telefone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="random">Chave Aleatória</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pixKey" className="text-emerald-900">Chave PIX</Label>
                <Input
                  id="pixKey"
                  data-testid="pix-key-input"
                  type="text"
                  placeholder="Digite sua chave PIX"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  required
                  className="border-emerald-300"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !amount || parseFloat(amount) < 45}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 font-semibold"
                data-testid="submit-withdrawal-btn"
              >
                <Banknote className="mr-2 h-5 w-5" />
                {loading ? 'Enviando...' : 'Solicitar Saque'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Withdrawals History */}
        <Card className="border-emerald-200 shadow-lg" data-testid="withdrawals-history-card">
          <CardHeader>
            <CardTitle className="text-emerald-900">Histórico de Saques</CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <p className="text-center text-emerald-700 py-8">Nenhum saque ainda</p>
            ) : (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="border border-emerald-200 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`withdrawal-${withdrawal.id}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-2xl font-bold text-emerald-900">R$ {withdrawal.amount.toFixed(2)}</p>
                        <p className="text-xs text-emerald-600">{new Date(withdrawal.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(withdrawal.status)}`} data-testid={`withdrawal-status-${withdrawal.id}`}>
                        {getStatusText(withdrawal.status)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Taxa:</span>
                        <span className="text-emerald-900">R$ {withdrawal.fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Valor líquido:</span>
                        <span className="font-semibold text-emerald-900">R$ {withdrawal.net_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Chave PIX ({withdrawal.pix_key_type}):</span>
                        <span className="text-emerald-900 font-mono">{withdrawal.pix_key}</span>
                      </div>
                    </div>
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
