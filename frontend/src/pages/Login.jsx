import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Leaf, Lock, Phone } from 'lucide-react';

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { phone, password });
      toast.success('Login realizado com sucesso!');
      onLogin(res.data.token, res.data.user);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-emerald-200" data-testid="login-card">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-emerald-900">Wealth Farm</CardTitle>
          <CardDescription className="text-base text-emerald-700">Invista e colha seus lucros</CardDescription>
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
                  placeholder="51920020786"
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
            <Button
              type="submit"
              data-testid="login-submit-btn"
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-emerald-700">
              Não tem conta?{' '}
              <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-800 underline" data-testid="register-link">
                Cadastre-se
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
