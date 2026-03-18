import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Leaf, Lock, Phone, UserPlus } from 'lucide-react';

export default function Register({ onLogin }) {
  const { referralCode } = useParams();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', { 
        phone, 
        password,
        referred_by: referralCode || null
      });
      toast.success('Cadastro realizado com sucesso!');
      onLogin(res.data.token, res.data.user);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-emerald-200" data-testid="register-card">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-emerald-900">Wealth Farm</CardTitle>
          <CardDescription className="text-base text-emerald-700">Crie sua conta e comece a investir</CardDescription>
          {referralCode && (
            <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-3">
              <p className="text-sm text-emerald-800 font-medium">Código de indicação: {referralCode}</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-emerald-900">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-emerald-600" />
                <Input
                  id="phone"
                  data-testid="phone-input"
                  type="tel"
                  placeholder="Digite seu telefone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="pl-10 border-emerald-300 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-emerald-900">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-600" />
                <Input
                  id="password"
                  data-testid="password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 border-emerald-300 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-emerald-900">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-600" />
                <Input
                  id="confirmPassword"
                  data-testid="confirm-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 border-emerald-300 focus:border-emerald-500"
                />
              </div>
            </div>
            <Button
              type="submit"
              data-testid="register-submit-btn"
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-emerald-700">
              Já tem conta?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-800 underline" data-testid="login-link">
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
