import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { formatPrice, formatDateTime } from '../../utils';
import type { OrderStatus } from '../../types';

export default function UserOrders() {
  const { myOrders, updateOrderStatus } = useUserStore();
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending_pay', label: '待付款' },
    { key: 'paid', label: '待发货' },
    { key: 'shipped', label: '待收货' },
    { key: 'completed', label: '已完成' },
  ];

  const filteredOrders = activeTab === 'all'
    ? myOrders
    : myOrders.filter(o => o.status === activeTab);

  const handlePay = (orderId: string) => {
    updateOrderStatus(orderId, 'paid');
  };

  const handleConfirmReceive = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
  };

  const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
    pending_pay: { label: '待付款', icon: Clock, color: 'text-accent-500 bg-accent-50' },
    paid: { label: '待发货', icon: Package, color: 'text-primary-500 bg-primary-50' },
    shipped: { label: '待收货', icon: Truck, color: 'text-secondary-500 bg-secondary-50' },
    completed: { label: '已完成', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
    cancelled: { label: '已取消', icon: XCircle, color: 'text-gray-500 bg-gray-100' },
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">我的订单</h1>

      <div className="card mb-6">
        <div className="flex border-b border-warm-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-6 py-4 font-medium transition-colors relative ${
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
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">暂无订单</h3>
          <p className="text-gray-400 mb-4">去逛逛看看有什么心仪的物品吧</p>
          <Link to="/activities" className="btn-primary inline-block">
            去逛逛
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const config = statusConfig[order.status];
            return (
              <div key={order.id} className="card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 bg-warm-50 border-b border-warm-100">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      订单号：{order.id}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${config.color}`}>
                    <config.icon className="w-4 h-4" />
                    {config.label}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex gap-4">
                    <Link to={`/item/${order.itemId}`}>
                      <img
                        src={order.itemImage}
                        alt={order.itemName}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/item/${order.itemId}`}
                        className="font-medium text-gray-800 hover:text-primary-500 transition-colors"
                      >
                        {order.itemName}
                      </Link>
                      <div className="text-sm text-gray-500 mt-2">
                        捐赠者：{order.donorName || '爱心人士'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.type === 'auction' ? '竞拍所得' : '即时购买'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary-500">
                        {formatPrice(order.amount)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-warm-100">
                    {order.status === 'pending_pay' && (
                      <>
                        <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                          取消订单
                        </button>
                        <button
                          onClick={() => handlePay(order.id)}
                          className="btn-primary px-6 py-2 text-sm"
                        >
                          立即付款
                        </button>
                      </>
                    )}
                    {order.status === 'paid' && (
                      <span className="text-sm text-gray-500">等待卖家发货</span>
                    )}
                    {order.status === 'shipped' && (
                      <>
                        <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                          查看物流
                        </button>
                        <button
                          onClick={() => handleConfirmReceive(order.id)}
                          className="btn-primary px-6 py-2 text-sm"
                        >
                          确认收货
                        </button>
                      </>
                    )}
                    {order.status === 'completed' && (
                      <button className="px-4 py-2 text-sm text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50">
                        再次购买
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
