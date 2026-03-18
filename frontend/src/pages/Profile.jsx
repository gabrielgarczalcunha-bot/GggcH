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
              A Wealth Farm é uma plataforma de investimentos inovadora, fundada em 2012, 
              com o objetivo de democratizar o acesso a oportunidades de rendimento passivo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-700 mb-1">Ano de Fundação</p>
                <p className="text-2xl font-bold text-emerald-900">2012</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-700 mb-1">Certificação</p>
                <p className="text-lg font-semibold text-emerald-900">Certificado pela Anvisa</p>
              </div>
            </div>
            <div className="border-t border-emerald-200 pt-4">
              <h4 className="font-semibold text-emerald-900 mb-2">Avaliação</h4>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-500 text-2xl">★</span>
                  ))}
                </div>
                <span className="text-emerald-700">5.0 / 5.0</span>
              </div>
            </div>
            <div className="border-t border-emerald-200 pt-4">
              <h4 className="font-semibold text-emerald-900 mb-2">Nossa Missão</h4>
              <p className="text-emerald-700">
                Proporcionar aos nossos clientes retornos consistentes e transparentes através 
                de uma plataforma segura e fácil de usar, construindo confiança e prosperidade mútua.
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
