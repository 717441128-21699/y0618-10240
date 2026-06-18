import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Package, ShoppingCart, 
  FileText, Settings, LogOut, Building2
} from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export default function OrgAdminLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useUserStore();

  const menuItems = [
    { path: '/org', label: '数据概览', icon: LayoutDashboard },
    { path: '/org/activities', label: '活动管理', icon: Calendar },
    { path: '/org/items', label: '物品管理', icon: Package },
    { path: '/org/orders', label: '订单管理', icon: ShoppingCart },
    { path: '/org/reports', label: '公示报告', icon: FileText },
    { path: '/org/settings', label: '机构设置', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-warm-50 flex">
      <aside className="w-64 bg-navy-600 text-white flex-shrink-0">
        <div className="p-6 border-b border-navy-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg">机构后台</div>
              <div className="text-xs text-white/60">{currentUser?.name}</div>
            </div>
          </div>
        </div>

        <nav className="p-4">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/org'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}

          <hr className="my-4 border-navy-500" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
