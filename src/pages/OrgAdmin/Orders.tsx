import { useState, useMemo } from 'react';
import { Package, Truck, CheckCircle, Clock, Search, Eye, Send, X } from 'lucide-react';
import { useActivityStore } from '../../store/useActivityStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useUserStore } from '../../store/useUserStore';
import { formatPrice, formatDateTime } from '../../utils';
import type { Order, OrderStatus } from '../../types';
import Modal from '../../components/common/Modal';

export default function OrgOrders() {
  const { getActivitiesByOrgId } = useActivityStore();
  const { orders, getOrdersByOrgActivities } = useOrderStore();
  const { currentUser, allUsers } = useUserStore();
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shipModal, setShipModal] = useState<{ orderId: string; trackingNo: string } | null>(null);
  const [shippingId, setShippingId] = useState<string | null>(null);
  const { shipOrder } = useActivityStore();

  const orgOrders = useMemo(() => {
    if (!currentUser?.orgId) return [] as Order[];
    const activityIds = getActivitiesByOrgId(currentUser.orgId).map(a => a.id);
    return getOrdersByOrgActivities(activityIds);
  }, [currentUser, orders, getActivitiesByOrgId, getOrdersByOrgActivities]);

  const tabs = [
    { key: 'all', label: '全部订单' },
    { key: 'pending_pay', label: '待付款' },
    { key: 'paid', label: '待发货' },
    { key: 'shipped', label: '待收货' },
    { key: 'completed', label: '已完成' },
  ];

  const filteredOrders = orgOrders.filter(order => {
    if (activeTab !== 'all' && order.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const buyer = allUsers.find(u => u.id === order.userId);
      return (
        order.itemName.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        (buyer && buyer.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleShipSubmit = async () => {
    if (!shipModal) return;
    setShippingId(shipModal.orderId);
    await new Promise(r => setTimeout(r, 600));
    shipOrder(shipModal.orderId, shipModal.trackingNo || undefined);
    setShippingId(null);
    setShipModal(null);
  };

  const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
    pending_pay: { label: '待付款', icon: Clock, color: 'text-accent-500 bg-accent-50' },
    paid: { label: '待发货', icon: Package, color: 'text-primary-500 bg-primary-50' },
    shipped: { label: '待收货', icon: Truck, color: 'text-secondary-500 bg-secondary-50' },
    completed: { label: '已完成', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
    cancelled: { label: '已取消', icon: Clock, color: 'text-gray-500 bg-gray-100' },
  };

  const typeLabel: Record<string, string> = {
    auction: '竞拍',
    buynow: '即时购',
  };

  const statData = useMemo(() => {
    return {
      total: orgOrders.length,
      pendingPay: orgOrders.filter(o => o.status === 'pending_pay').length,
      paid: orgOrders.filter(o => o.status === 'paid').length,
      shipped: orgOrders.filter(o => o.status === 'shipped').length,
      completed: orgOrders.filter(o => o.status === 'completed').length,
      amount: orgOrders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'completed')
        .reduce((sum, o) => sum + o.amount, 0),
    };
  }, [orgOrders]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">订单管理</h1>
          <p className="text-gray-500 mt-1">管理您的义卖订单</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card p-4">
          <div className="text-sm text-gray-500">订单总数</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{statData.total}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">待付款</div>
          <div className="text-2xl font-bold text-accent-500 mt-1">{statData.pendingPay}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">待发货</div>
          <div className="text-2xl font-bold text-primary-500 mt-1">{statData.paid}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">待收货</div>
          <div className="text-2xl font-bold text-secondary-500 mt-1">{statData.shipped}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">有效成交额</div>
          <div className="text-xl font-bold text-green-500 mt-1">{formatPrice(statData.amount)}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft mb-6">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 flex-wrap gap-3">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-4 font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-primary-50' : 'bg-warm-100'
                }`}>
                  {tab.key === 'all' ? orgOrders.length :
                   tab.key === 'pending_pay' ? statData.pendingPay :
                   tab.key === 'paid' ? statData.paid :
                   tab.key === 'shipped' ? statData.shipped :
                   statData.completed}
                </span>
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="relative py-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索物品/订单号/买家..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">订单信息</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">买家</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">类型</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">金额</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">状态</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">时间</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? filteredOrders.map(order => {
                const config = statusConfig[order.status];
                const buyer = allUsers.find(u => u.id === order.userId);
                const isShipping = shippingId === order.id;
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
                          {order.trackingNo && (
                            <div className="text-xs text-secondary-600 mt-0.5">
                              运单号：{order.trackingNo}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {buyer && (
                          <img src={buyer.avatar} alt={buyer.name} className="w-6 h-6 rounded-full" />
                        )}
                        <span className="text-sm text-gray-700">{buyer?.name || '爱心用户'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-warm-100 text-gray-600">
                        {typeLabel[order.type] || order.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary-500 font-bold text-sm">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${config.color}`}>
                        <config.icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
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
                            disabled={isShipping}
                            onClick={() => setShipModal({ orderId: order.id, trackingNo: '' })}
                            className="text-xs bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 inline-flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <Send className="w-3 h-3" />
                            {isShipping ? '发货中...' : '发货'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-gray-400">暂无订单</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={!!shipModal} 
        onClose={() => !shippingId && setShipModal(null)} 
        title="订单发货"
        width="max-w-md"
      >
        {shipModal && (
          <div className="space-y-5">
            <div className="p-4 bg-warm-50 rounded-xl">
              <p className="text-sm text-gray-600">
                订单号：<span className="font-mono text-primary-500">{shipModal.orderId}</span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                快递运单号 <span className="text-gray-400 font-normal">（选填）</span>
              </label>
              <input
                type="text"
                value={shipModal.trackingNo}
                onChange={e => setShipModal({ ...shipModal, trackingNo: e.target.value })}
                placeholder="例如：SF1234567890123"
                className="input-base"
              />
              <p className="text-xs text-gray-400 mt-1">填写后买家可在订单详情中查看物流信息</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={!!shippingId}
                onClick={() => setShipModal(null)}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-warm-50 disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleShipSubmit}
                disabled={!!shippingId}
                className="btn-primary px-8 py-2.5 inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                <Send className={`w-4 h-4 ${shippingId ? 'animate-pulse' : ''}`} />
                {shippingId ? '确认中...' : '确认发货'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
