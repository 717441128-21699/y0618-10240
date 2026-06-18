import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Heart, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, allUsers } = useUserStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (!name.trim()) {
        setError('请输入昵称');
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        setError('请输入有效的11位手机号');
        return;
      }
      if (!email.trim()) {
        setError('请输入邮箱');
        return;
      }

      const result = register({
        nickname: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      if (!result.success) {
        setError(result.message || '注册失败');
        return;
      }

      const redirect = searchParams.get('redirect') || '/user';
      navigate(redirect, { replace: true });
      return;
    }

    let userId = '';
    const matchedByEmail = allUsers.find(u => u.email === email.trim());
    if (matchedByEmail) {
      userId = matchedByEmail.id;
    } else if (email === 'user') {
      userId = 'user-1';
    } else if (email === 'org') {
      userId = 'user-2';
    } else if (email === 'admin') {
      userId = 'user-3';
    }

    if (!userId) {
      setError('该账号不存在，请先注册或使用快捷登录（输入 user/org/admin 任意一个即可直接登录）');
      return;
    }

    const ok = login(userId);
    if (!ok) {
      setError('登录失败');
      return;
    }

    const user = allUsers.find(u => u.id === userId);
    const isOrgOrAdmin = user?.role === 'org' || user?.role === 'organization' || user?.role === 'admin';
    const defaultRedirect = isOrgOrAdmin ? '/org' : '/';
    const redirect = searchParams.get('redirect') || defaultRedirect;
    navigate(redirect, { replace: true });
  };

  const handleOrgLogin = () => {
    setError('');
    login('user-2');
    const redirect = searchParams.get('redirect') || '/org';
    navigate(redirect, { replace: true });
  };

  const handleQuickLogin = (userId: string, roleName: string) => {
    setError('');
    login(userId);
    const redirect = userId === 'user-2' || userId === 'user-3' ? '/org' : '/';
    navigate(redirect, { replace: true });
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
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                isLogin ? 'bg-white text-primary-500 shadow-sm' : 'text-gray-500'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                !isLogin ? 'bg-white text-primary-500 shadow-sm' : 'text-gray-500'
              }`}
            >
              注册
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
                {isLogin ? '账号 / 邮箱' : '邮箱'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={isLogin ? '输入邮箱或快捷词: user / org / admin' : '请输入邮箱'}
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
                    placeholder="请输入11位手机号"
                    className="input-base pl-10"
                    maxLength={11}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码 {!isLogin && <span className="text-gray-400 font-normal">（至少6位）</span>}
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
              {isLogin ? '登录' : '注册并登录'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warm-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">快捷体验</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin('user-1', '普通用户')}
                className="py-2 text-xs border border-warm-200 rounded-lg text-gray-600 hover:bg-warm-50 transition-colors"
              >
                👤 普通用户
              </button>
              <button
                onClick={handleOrgLogin}
                className="py-2 text-xs border border-warm-200 rounded-lg text-gray-600 hover:bg-warm-50 transition-colors"
              >
                🏢 公益机构
              </button>
              <button
                onClick={() => handleQuickLogin('user-3', '管理员')}
                className="py-2 text-xs border border-warm-200 rounded-lg text-gray-600 hover:bg-warm-50 transition-colors"
              >
                👑 管理员
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              注册需填写昵称、邮箱、手机号。登录时可直接输入 user / org / admin 快捷登录对应角色
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-primary-500 hover:underline ml-1"
          >
            {isLogin ? '立即注册' : '立即登录'}
          </button>
        </p>
      </div>
    </div>
  );
}
