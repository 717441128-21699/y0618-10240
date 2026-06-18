import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Gavel, ShoppingBag, User as UserIcon, 
  MapPin, Settings, LogOut, Heart 
} from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export default function UserCenterLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useUserStore();

  const menuItems = [
    { path: '/user', label: '个人概览', icon: LayoutDashboard },
    { path: '/user/bids', label: '我的竞拍', icon: Gavel },
    { path: '/user/orders', label: '我的订单', icon: ShoppingBag },
    { path: '/user/addresses', label: '收货地址', icon: MapPin },
    { path: '/user/profile', label: '个人资料', icon: UserIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="container py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="card p-6 mb-6 text-center">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-20 h-20 rounded-full mx-auto mb-3 bg-warm-200"
              />
              <h3 className="font-medium text-gray-800">{currentUser?.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {currentUser?.role === 'organization' ? '公益机构' : '爱心用户'}
              </p>
            </div>

            <nav className="card p-2">
              {menuItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/user'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-500 font-medium'
                        : 'text-gray-600 hover:bg-warm-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}

              <hr className="my-2 border-warm-100" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>退出登录</span>
              </button>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
