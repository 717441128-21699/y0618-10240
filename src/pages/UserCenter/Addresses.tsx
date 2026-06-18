import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Phone, User } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export default function UserAddresses() {
  const { addresses } = useUserStore();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-800">收货地址</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 text-sm py-2.5"
        >
          <Plus className="w-4 h-4" />
          新增地址
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">暂无收货地址</h3>
          <p className="text-gray-400 mb-4">添加一个收货地址吧</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary inline-block"
          >
            添加地址
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className="card p-5 hover:shadow-card transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-800">{addr.recipient}</span>
                  {addr.isDefault && (
                    <span className="badge bg-primary-100 text-primary-600 text-xs">
                      默认
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-warm-100 rounded-lg text-gray-400 hover:text-primary-500 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{addr.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>
                  {addr.province} {addr.city} {addr.district} {addr.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
