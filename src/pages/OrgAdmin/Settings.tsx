import { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Save, Upload } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export default function OrgSettings() {
  const { currentUser } = useUserStore();
  const [orgName, setOrgName] = useState(currentUser?.name || '');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">机构设置</h1>

      <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-6">机构信息</h2>

        <div className="flex items-start gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <div className="pt-2">
            <p className="text-gray-600 mb-1">机构Logo</p>
            <p className="text-sm text-gray-400">支持 JPG、PNG 格式，建议尺寸 200x200</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              机构名称
            </label>
            <input
              type="text"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2 text-gray-400" />
              联系邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2 text-gray-400" />
              联系电话
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              联系人
            </label>
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="请输入联系人姓名"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2 text-gray-400" />
              机构地址
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="请输入详细地址"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              机构简介
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="请简要介绍您的机构..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all resize-none"
            />
          </div>
        </div>

        <div className="mt-8">
          <button className="px-8 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            保存修改
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h2 className="font-semibold text-gray-800 mb-6">资质认证</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-800">公益机构资质认证</div>
              <div className="text-sm text-gray-500 mt-1">已通过平台审核认证</div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
              已认证
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-800">组织机构代码证</div>
              <div className="text-sm text-gray-500 mt-1">已上传并审核通过</div>
            </div>
            <button className="text-primary-500 text-sm hover:underline">
              查看
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
