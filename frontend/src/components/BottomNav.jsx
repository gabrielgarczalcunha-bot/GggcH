import { useNavigate, useLocation } from 'react-router-dom';
import { Wallet, DollarSign, ShoppingBag, TrendingUp, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-green-600' : 'text-gray-500'}`}
            data-testid="nav-home-bottom"
          >
            <div className={`p-2 rounded-full ${isActive('/') ? 'bg-green-100' : ''}`}>
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Início</span>
          </button>
          <button
            onClick={() => navigate('/deposits')}
            className={`flex flex-col items-center gap-1 ${isActive('/deposits') ? 'text-green-600' : 'text-gray-500'}`}
            data-testid="nav-deposits-bottom"
          >
            <DollarSign className="h-6 w-6" />
            <span className="text-xs">Recarga</span>
          </button>
          <button
            onClick={() => navigate('/my-lots')}
            className={`flex flex-col items-center gap-1 ${isActive('/my-lots') ? 'text-green-600' : 'text-gray-500'}`}
            data-testid="nav-lots-bottom"
          >
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xs">Lotes</span>
          </button>
          <button
            onClick={() => navigate('/withdrawals')}
            className={`flex flex-col items-center gap-1 ${isActive('/withdrawals') ? 'text-green-600' : 'text-gray-500'}`}
            data-testid="nav-withdrawals-bottom"
          >
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">Saque</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-green-600' : 'text-gray-500'}`}
            data-testid="nav-profile-bottom"
          >
            <User className="h-6 w-6" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
