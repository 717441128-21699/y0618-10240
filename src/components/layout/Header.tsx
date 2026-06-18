import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, User, Menu, X, Building2 } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/activities?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-warm-200">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-serif text-xl font-bold text-navy-600">
              爱心义卖
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-primary-500 transition-colors font-medium">
              首页
            </Link>
            <Link to="/activities" className="text-gray-600 hover:text-primary-500 transition-colors font-medium">
              义卖活动
            </Link>
            <Link to="/transparency" className="text-gray-600 hover:text-primary-500 transition-colors font-medium">
              透明公示
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="搜索活动或物品..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-56 pl-10 pr-4 py-2 bg-warm-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-warm-100 transition-colors"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full bg-warm-200"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser?.name}
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card py-2 animate-fade-in-up">
                    {currentUser?.role === 'organization' && (
                      <Link
                        to="/org"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-warm-50 text-gray-700"
                      >
                        <Building2 className="w-4 h-4" />
                        机构后台
                      </Link>
                    )}
                    <Link
                      to="/user"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-warm-50 text-gray-700"
                    >
                      <User className="w-4 h-4" />
                      个人中心
                    </Link>
                    <hr className="my-2 border-warm-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-warm-50 text-red-500"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium text-white bg-primary-500 rounded-full hover:bg-primary-600 transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in-up">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="搜索活动或物品..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-warm-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
            <nav className="flex flex-col gap-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-warm-50 rounded-lg">
                首页
              </Link>
              <Link to="/activities" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-warm-50 rounded-lg">
                义卖活动
              </Link>
              <Link to="/transparency" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-warm-50 rounded-lg">
                透明公示
              </Link>
              {isLoggedIn ? (
                <>
                  <Link to="/user" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-warm-50 rounded-lg">
                    个人中心
                  </Link>
                  {currentUser?.role === 'organization' && (
                    <Link to="/org" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-warm-50 rounded-lg">
                      机构后台
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-left px-4 py-2 text-red-500">
                    退出登录
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1 text-center py-2 border border-primary-500 text-primary-500 rounded-full">
                    登录
                  </Link>
                  <Link to="/register" className="flex-1 text-center py-2 bg-primary-500 text-white rounded-full">
                    注册
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
