import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Heart, Mail, Lock, User, Phone } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useUserStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('user-1');
    const redirect = searchParams.get('redirect') || '/';
    navigate(redirect);
  };

  const handleOrgLogin = () => {
    login('user-2');
    const redirect = searchParams.get('redirect') || '/org';
    navigate(redirect);
  };

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-warm flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? '欢迎回来' : '加入我们'}
          </h1>
          <p className="text-gray-500">
            {isLogin ? '登录您的爱心账户' : '注册爱心账户，开启公益之旅'}
          </p>
        </div>

        <div className="card p-8">
          <div className="flex mb-6 bg-warm-100 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                isLogin ? 'bg-white text-primary-500 shadow-sm' : 'text-gray-500'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                !isLogin ? 'bg-white text-primary-500 shadow-sm' : 'text-gray-500'
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  昵称
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="请输入昵称"
                    className="input-base pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className="input-base pl-10"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  手机号
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="input-base pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="input-base pl-10"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary-500 hover:underline">
                  忘记密码？
                </a>
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-3">
              {isLogin ? '登录' : '注册'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warm-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">其他登录方式</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleOrgLogin}
                className="text-sm text-navy-500 hover:underline"
              >
                公益机构登录入口 →
              </button>
              <p className="text-xs text-gray-400 mt-2">
                测试账号：点击上方按钮体验机构后台
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-500 hover:underline ml-1"
          >
            {isLogin ? '立即注册' : '立即登录'}
          </button>
        </p>
      </div>
    </div>
  );
}
