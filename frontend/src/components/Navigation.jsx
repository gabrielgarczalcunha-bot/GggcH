import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, Package, DollarSign, LogOut, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Início', path: '/', testId: 'nav-home' },
    { icon: Package, label: 'Meus Lotes', path: '/my-lots', testId: 'nav-my-lots' },
    { icon: DollarSign, label: 'Depósitos', path: '/deposits', testId: 'nav-deposits' },
    { icon: DollarSign, label: 'Saques', path: '/withdrawals', testId: 'nav-withdrawals' },
    { icon: User, label: 'Perfil', path: '/profile', testId: 'nav-profile' },
  ];

  if (user?.is_admin) {
    menuItems.push({ icon: Shield, label: 'Admin', path: '/admin', testId: 'nav-admin' });
  }

  return (
    <nav className="bg-white border-b border-emerald-200 shadow-sm" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-2"
              data-testid="nav-logo"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌱</span>
              </div>
              Wealth Farm
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                variant="ghost"
                className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
                data-testid={item.testId}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
            <Button
              onClick={onLogout}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              data-testid="nav-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="icon"
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-200 bg-white" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
                data-testid={`${item.testId}-mobile`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
            <Button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              variant="outline"
              className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
              data-testid="nav-logout-mobile"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
