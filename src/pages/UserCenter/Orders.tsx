import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, XCircle, CreditCard, Box, Check } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useActivityStore } from '../../store/useActivityStore';
import { useUserStore } from '../../store/useUserStore';
import { formatPrice, formatDateTime, getOrderStatusLabel } from '../../utils';
import type { OrderStatus } from '../../types';

export default function UserOrders() {
  const { orders, getOrdersByUserId } = useOrderStore();
  const { payOrder, confirmReceive } = useActivityStore();
  const { currentUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [payingId, setPayingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    return getOrdersByUserId(currentUser.id);
  }, [currentUser, orders, getOrdersByUserId]);

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

  const handlePay = async (orderId: string) => {
    setPayingId(orderId);
    await new Promise(r => setTimeout(r, 800));
    payOrder(orderId);
    setPayingId(null);
  };

  const handleConfirmReceive = async (orderId: string) => {
    setConfirmingId(orderId);
    await new Promise(r => setTimeout(r, 500));
    confirmReceive(orderId);
    setConfirmingId(null);
  };

  const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
    pending_pay: { label: '待付款', icon: Clock, color: 'text-accent-500 bg-accent-50' },
    paid: { label: '待发货', icon: Package, color: 'text-primary-500 bg-primary-50' },
    shipped: { label: '待收货', icon: Truck, color: 'text-secondary-500 bg-secondary-50' },
    completed: { label: '已完成', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
    cancelled: { label: '已取消', icon: XCircle, color: 'text-gray-500 bg-gray-100' },
  };

  const typeLabel: Record<string, string> = {
    auction: '竞拍所得',
    buynow: '即时购买',
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">我的订单</h1>

      <div className="card mb-6 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-warm-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-primary-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-primary-50' : 'bg-warm-100'
              }`}>
                {tab.key === 'all' ? myOrders.length : myOrders.filter(o => o.status === tab.key).length}
              </span>
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
            const isPaying = payingId === order.id;
            const isConfirming = confirmingId === order.id;
            return (
              <div key={order.id} className="card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 bg-warm-50 border-b border-warm-100 flex-wrap gap-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm text-gray-500">
                      订单号：{order.id}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formatDateTime(order.createdAt)}
                    </span>
                    {order.trackingNo && (
                      <span className="text-xs bg-secondary-50 text-secondary-600 px-2 py-0.5 rounded-full">
                        📦 运单：{order.trackingNo}
                      </span>
                    )}
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
                    <div className="flex-1 min-w-0">
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
                        {typeLabel[order.type] || order.type}
                      </div>
                      {order.payTime && (
                        <div className="text-xs text-gray-400 mt-1">
                          付款时间：{formatDateTime(order.payTime)}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold text-primary-500">
                        {formatPrice(order.amount)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-warm-100 flex-wrap">
                    {order.status === 'pending_pay' && (
                      <>
                        <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                          取消订单
                        </button>
                        <button
                          disabled={isPaying}
                          onClick={() => handlePay(order.id)}
                          className="btn-primary px-6 py-2 text-sm inline-flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <CreditCard className={`w-4 h-4 ${isPaying ? 'animate-pulse' : ''}`} />
                          {isPaying ? '付款中...' : '立即付款'}
                        </button>
                      </>
                    )}
                    {order.status === 'paid' && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Box className="w-4 h-4 text-primary-500" />
                        等待机构安排发货...
                      </div>
                    )}
                    {order.status === 'shipped' && (
                      <>
                        {order.trackingNo && (
                          <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
                            <Truck className="w-4 h-4" />
                            查看物流
                          </button>
                        )}
                        <button
                          disabled={isConfirming}
                          onClick={() => handleConfirmReceive(order.id)}
                          className="btn-primary px-6 py-2 text-sm inline-flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <Check className={`w-4 h-4 ${isConfirming ? 'animate-pulse' : ''}`} />
                          {isConfirming ? '确认中...' : '确认收货'}
                        </button>
                      </>
                    )}
                    {order.status === 'completed' && (
                      <Link
                        to="/activities"
                        className="px-4 py-2 text-sm text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50"
                      >
                        继续公益
                      </Link>
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
