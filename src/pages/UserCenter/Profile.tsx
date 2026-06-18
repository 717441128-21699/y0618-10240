import { useState } from 'react';
import { User as UserIcon, Mail, Phone, Camera, Save } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export default function UserProfile() {
  const { currentUser } = useUserStore();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">个人资料</h1>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-6">头像设置</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={currentUser?.avatar}
              alt="头像"
              className="w-24 h-24 rounded-full bg-warm-100"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="text-gray-600 mb-2">支持 JPG、PNG 格式</p>
            <p className="text-gray-400 text-sm">建议尺寸 200x200 像素</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-800 mb-6">基本信息</h2>
        
        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-4 h-4 inline mr-2 text-gray-400" />
              昵称
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2 text-gray-400" />
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2 text-gray-400" />
              手机号
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="input-base"
            />
          </div>

          <button className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            保存修改
          </button>
        </div>
      </div>
    </div>
  );
}
