import { useState, useEffect } from 'react';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { Users, TrendingUp, TrendingDown, AlertCircle, Check, X } from 'lucide-react';

export default function AdminPanel({ user, onLogout }) {
  const [stats, setStats] = useState({});
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, depositsRes, withdrawalsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/deposits/pending'),
        api.get('/admin/withdrawals/pending'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setPendingDeposits(depositsRes.data.deposits);
      setPendingWithdrawals(withdrawalsRes.data.withdrawals);
      setAllUsers(usersRes.data.users);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Erro ao carregar dados');
    }
  };

  const handleApproveDeposit = async (transactionId, approved) => {
    setLoading(true);
    try {
      await api.post('/admin/deposits/approve', {
        transaction_id: transactionId,
        approved
      });
      toast.success(approved ? 'Depósito aprovado!' : 'Depósito rejeitado!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao processar depósito');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWithdrawal = async (transactionId, approved) => {
    setLoading(true);
    try {
      await api.post('/admin/withdrawals/approve', {
        transaction_id: transactionId,
        approved
      });
      toast.success(approved ? 'Saque aprovado!' : 'Saque rejeitado!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao processar saque');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <Navigation user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8" data-testid="admin-panel-container">
        <h1 className="text-4xl font-bold text-emerald-900 mb-8">Painel Administrativo</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-emerald-200 shadow-lg" data-testid="total-users-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Total de Usuários</CardTitle>
              <Users className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{stats.total_users || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-lg" data-testid="total-deposits-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Total Depositado</CardTitle>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">R$ {(stats.total_deposits_amount || 0).toFixed(2)}</div>
              <p className="text-xs text-emerald-600 mt-1">{stats.total_deposits || 0} transações</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-lg" data-testid="total-withdrawals-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Total Sacado</CardTitle>
              <TrendingDown className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">R$ {(stats.total_withdrawals_amount || 0).toFixed(2)}</div>
              <p className="text-xs text-emerald-600 mt-1">{stats.total_withdrawals || 0} transações</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 shadow-lg" data-testid="pending-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Pendentes</CardTitle>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900">{(stats.pending_deposits || 0) + (stats.pending_withdrawals || 0)}</div>
              <p className="text-xs text-yellow-600 mt-1">
                {stats.pending_deposits || 0} depósitos, {stats.pending_withdrawals || 0} saques
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="deposits" className="space-y-6">
          <TabsList className="bg-white border border-emerald-200">
            <TabsTrigger value="deposits" className="data-[state=active]:bg-emerald-100" data-testid="deposits-tab">
              Depósitos Pendentes ({pendingDeposits.length})
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="data-[state=active]:bg-emerald-100" data-testid="withdrawals-tab">
              Saques Pendentes ({pendingWithdrawals.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-100" data-testid="users-tab">
              Usuários ({allUsers.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Deposits */}
          <TabsContent value="deposits" data-testid="deposits-tab-content">
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-900">Solicitações de Depósito</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingDeposits.length === 0 ? (
                  <p className="text-center text-emerald-700 py-8">Nenhuma solicitação pendente</p>
                ) : (
                  <div className="space-y-4">
                    {pendingDeposits.map((deposit) => (
                      <div key={deposit.id} className="border border-emerald-200 rounded-lg p-4" data-testid={`pending-deposit-${deposit.id}`}>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-2xl font-bold text-emerald-900">R$ {deposit.amount.toFixed(2)}</p>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pendente</span>
                            </div>
                            <p className="text-sm text-emerald-700 mb-1">Usuário: <span className="font-semibold">{deposit.user_phone}</span></p>
                            <p className="text-xs text-emerald-600">{new Date(deposit.created_at).toLocaleString('pt-BR')}</p>
                            <a 
                              href={deposit.proof_image_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-emerald-600 hover:underline inline-block mt-2"
                            >
                              Ver comprovante →
                            </a>
                          </div>
                          <div className="flex md:flex-col gap-2">
                            <Button
                              onClick={() => handleApproveDeposit(deposit.id, true)}
                              disabled={loading}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              data-testid={`approve-deposit-${deposit.id}-btn`}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Aprovar
                            </Button>
                            <Button
                              onClick={() => handleApproveDeposit(deposit.id, false)}
                              disabled={loading}
                              variant="destructive"
                              className="flex-1"
                              data-testid={`reject-deposit-${deposit.id}-btn`}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Rejeitar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Withdrawals */}
          <TabsContent value="withdrawals" data-testid="withdrawals-tab-content">
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-900">Solicitações de Saque</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingWithdrawals.length === 0 ? (
                  <p className="text-center text-emerald-700 py-8">Nenhuma solicitação pendente</p>
                ) : (
                  <div className="space-y-4">
                    {pendingWithdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="border border-emerald-200 rounded-lg p-4" data-testid={`pending-withdrawal-${withdrawal.id}`}>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-2xl font-bold text-emerald-900">R$ {withdrawal.amount.toFixed(2)}</p>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pendente</span>
                            </div>
                            <p className="text-sm text-emerald-700 mb-1">Usuário: <span className="font-semibold">{withdrawal.user_phone}</span></p>
                            <div className="space-y-1 text-sm mt-2">
                              <p className="text-emerald-700">Taxa: <span className="text-emerald-900 font-medium">R$ {withdrawal.fee.toFixed(2)}</span></p>
                              <p className="text-emerald-700">Valor líquido: <span className="text-emerald-900 font-semibold">R$ {withdrawal.net_amount.toFixed(2)}</span></p>
                              <p className="text-emerald-700">Chave PIX ({withdrawal.pix_key_type}): <span className="text-emerald-900 font-mono">{withdrawal.pix_key}</span></p>
                              <p className="text-xs text-emerald-600">{new Date(withdrawal.created_at).toLocaleString('pt-BR')}</p>
                            </div>
                          </div>
                          <div className="flex md:flex-col gap-2">
                            <Button
                              onClick={() => handleApproveWithdrawal(withdrawal.id, true)}
                              disabled={loading}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              data-testid={`approve-withdrawal-${withdrawal.id}-btn`}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Aprovar
                            </Button>
                            <Button
                              onClick={() => handleApproveWithdrawal(withdrawal.id, false)}
                              disabled={loading}
                              variant="destructive"
                              className="flex-1"
                              data-testid={`reject-withdrawal-${withdrawal.id}-btn`}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Rejeitar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users List */}
          <TabsContent value="users" data-testid="users-tab-content">
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-900">Lista de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allUsers.map((u) => (
                    <div key={u.id} className="border border-emerald-200 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`user-${u.id}`}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-emerald-900">{u.phone}</p>
                            {u.is_admin && (
                              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Admin</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>
                              <p className="text-emerald-600 text-xs">Saldo</p>
                              <p className="text-emerald-900 font-semibold">R$ {u.balance.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-emerald-600 text-xs">Ganhos</p>
                              <p className="text-emerald-900 font-semibold">R$ {u.total_earnings.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-emerald-600 text-xs">Código Ref</p>
                              <p className="text-emerald-900 font-mono text-xs">{u.referral_code}</p>
                            </div>
                            <div>
                              <p className="text-emerald-600 text-xs">Cadastro</p>
                              <p className="text-emerald-900 text-xs">{new Date(u.created_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
