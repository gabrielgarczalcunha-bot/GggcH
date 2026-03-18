import { useState } from 'react';
import { api } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { User, Phone, Shield, Award, Calendar } from 'lucide-react';

export default function Profile({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <Navigation user={user} onLogout={onLogout} />
      
      <div className="max-w-4xl mx-auto px-4 py-8" data-testid="profile-container">
        <h1 className="text-4xl font-bold text-emerald-900 mb-8">Perfil</h1>

        {/* User Info Card */}
        <Card className="mb-8 border-emerald-200 shadow-lg" data-testid="user-info-card">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
              <Phone className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-emerald-700">Telefone</p>
                <p className="font-semibold text-emerald-900">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
              <Award className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-emerald-700">Código de Indicação</p>
                <p className="font-semibold text-emerald-900">{user.referral_code}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-emerald-700">Membro desde</p>
                <p className="font-semibold text-emerald-900">{new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            {user.is_admin && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <Shield className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm text-amber-700">Tipo de Conta</p>
                  <p className="font-semibold text-amber-900">Administrador</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* About Company Card */}
        <Card className="mb-8 border-emerald-200 shadow-lg" data-testid="company-info-card">
          <CardHeader>
            <CardTitle className="text-emerald-900">Sobre a Wealth Farm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-emerald-800 leading-relaxed">
              A Wealth Farm é uma plataforma inovadora de investimentos agrícolas, fundada em 2012, 
              conectando investidores a oportunidades reais do agronegócio brasileiro com transparência e segurança.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-700 mb-1">Ano de Fundação</p>
                <p className="text-2xl font-bold text-emerald-900">2012</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-700 mb-1">Investidores Ativos</p>
                <p className="text-2xl font-bold text-emerald-900">+50.000</p>
              </div>
            </div>
            <div className="border-t border-emerald-200 pt-4">
              <h4 className="font-semibold text-emerald-900 mb-3">Certificações e Licenças</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-900">Certificação CNA</p>
                    <p className="text-xs text-green-700">Confederação da Agricultura e Pecuária do Brasil</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-900">Registro MAPA</p>
                    <p className="text-xs text-green-700">Ministério da Agricultura, Pecuária e Abastecimento</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-900">Certificação de Sustentabilidade</p>
                    <p className="text-xs text-green-700">Práticas agrícolas sustentáveis certificadas</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-emerald-200 pt-4">
              <h4 className="font-semibold text-emerald-900 mb-2">Avaliação dos Usuários</h4>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-500 text-2xl">★</span>
                  ))}
                </div>
                <span className="text-emerald-700 font-semibold">4.8 / 5.0</span>
                <span className="text-gray-500 text-sm">(12.459 avaliações)</span>
              </div>
            </div>
            <div className="border-t border-emerald-200 pt-4">
              <h4 className="font-semibold text-emerald-900 mb-2">Nossa Missão</h4>
              <p className="text-emerald-700">
                Democratizar o acesso aos investimentos no agronegócio brasileiro, permitindo que 
                qualquer pessoa possa investir no setor que mais cresce no país, com retornos 
                consistentes, transparentes e sustentáveis.
              </p>
            </div>
            <div className="border-t border-emerald-200 pt-4">
              <h4 className="font-semibold text-emerald-900 mb-2">Segurança</h4>
              <p className="text-emerald-700 text-sm">
                Todos os investimentos são lastreados em ativos reais do agronegócio. 
                Utilizamos tecnologia blockchain para garantir total transparência e rastreabilidade.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={onLogout}
          variant="destructive"
          className="w-full h-12 text-lg font-semibold"
          data-testid="logout-btn"
        >
          Sair da Conta
        </Button>
      </div>
    </div>
  );
}
