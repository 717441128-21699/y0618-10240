import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Search, Eye } from 'lucide-react';
import { mockOrders } from '../../mock';
import { formatPrice, formatDateTime } from '../../utils';
import type { OrderStatus } from '../../types';

export default function OrgOrders() {
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { key: 'all', label: '全部订单' },
    { key: 'paid', label: '待发货' },
    { key: 'shipped', label: '待收货' },
    { key: 'completed', label: '已完成' },
  ];

  const filteredOrders = mockOrders.filter(order => {
    if (activeTab !== 'all' && order.status !== activeTab) return false;
    if (searchQuery && !order.itemName.includes(searchQuery)) return false;
    return true;
  });

  const handleShip = (orderId: string) => {
    alert('发货功能：' + orderId);
  };

  const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
    pending_pay: { label: '待付款', icon: Clock, color: 'text-yellow-500 bg-yellow-50' },
    paid: { label: '待发货', icon: Package, color: 'text-blue-500 bg-blue-50' },
    shipped: { label: '待收货', icon: Truck, color: 'text-orange-500 bg-orange-50' },
    completed: { label: '已完成', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
    cancelled: { label: '已取消', icon: Clock, color: 'text-gray-500 bg-gray-50' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">订单管理</h1>
          <p className="text-gray-500 mt-1">管理您的义卖订单</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft mb-6">
        <div className="flex items-center justify-between border-b border-gray-100 px-6">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-4 font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 w-56"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">订单信息</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">金额</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">下单时间</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => {
              const config = statusConfig[order.status];
              return (
                <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.itemImage}
                        alt={order.itemName}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-800 text-sm line-clamp-1">
                          {order.itemName}
                        </div>
                        <div className="text-xs text-gray-400">
                          订单号：{order.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-primary-500 font-bold text-sm">
                    {formatPrice(order.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${config.color}`}>
                      <config.icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs text-gray-500 hover:text-primary-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        详情
                      </button>
                      {order.status === 'paid' && (
                        <button
                          onClick={() => handleShip(order.id)}
                          className="text-xs bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600"
                        >
                          发货
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无订单</p>
          </div>
        )}
      </div>
    </div>
  );
}
