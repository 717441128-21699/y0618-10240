import { Link } from 'react-router-dom';
import { Gavel, ShoppingBag, Heart, Gift, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useActivityStore } from '../../store/useActivityStore';
import { useOrderStore } from '../../store/useOrderStore';
import { formatPrice, formatNumber } from '../../utils';

export default function UserDashboard() {
  const { myBids, currentUser } = useUserStore();
  const { activities } = useActivityStore();
  const { orders, getOrdersByUserId } = useOrderStore();

  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    return getOrdersByUserId(currentUser.id);
  }, [currentUser, orders, getOrdersByUserId]);

  const totalSpent = myOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.amount, 0);

  const stats = [
    { label: '参与竞拍', value: myBids.length, icon: Gavel, color: 'text-primary-500', bg: 'bg-primary-50' },
    { label: '我的订单', value: myOrders.length, icon: ShoppingBag, color: 'text-secondary-500', bg: 'bg-secondary-50' },
    { label: '累计支出', value: formatPrice(totalSpent), icon: TrendingUp, color: 'text-accent-500', bg: 'bg-accent-50' },
    { label: '收藏活动', value: 3, icon: Heart, color: 'text-navy-500', bg: 'bg-navy-50' },
  ];

  const recentOrders = myOrders.slice(0, 3);
  const recentBids = myBids.slice(0, 3);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">个人中心</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={stat.label} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">最近订单</h2>
            <Link to="/user/orders" className="text-sm text-primary-500 hover:underline">
              查看全部
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无订单</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <Link
                  key={order.id}
                  to={`/user/orders`}
                  className="flex items-center gap-3 p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors"
                >
                  <img
                    src={order.itemImage}
                    alt={order.itemName}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm truncate">
                      {order.itemName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatPrice(order.amount)}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'pending_pay' ? 'bg-accent-100 text-accent-600' :
                    order.status === 'paid' ? 'bg-primary-100 text-primary-600' :
                    order.status === 'shipped' ? 'bg-secondary-100 text-secondary-600' :
                    order.status === 'completed' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {order.status === 'pending_pay' ? '待付款' :
                     order.status === 'paid' ? '待发货' :
                     order.status === 'shipped' ? '待收货' :
                     order.status === 'completed' ? '已完成' : '已取消'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">我的竞拍</h2>
            <Link to="/user/bids" className="text-sm text-primary-500 hover:underline">
              查看全部
            </Link>
          </div>
          {recentBids.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Gavel className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无竞拍记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBids.map(bid => (
                <div
                  key={bid.id}
                  className="flex items-center gap-3 p-3 bg-warm-50 rounded-xl"
                >
                  <Gavel className="w-8 h-8 text-primary-500 p-1.5 bg-primary-50 rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm">
                      出价 {formatPrice(bid.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(bid.createdAt).toLocaleString('zh-CN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">推荐活动</h2>
          <Link to="/activities" className="text-sm text-primary-500 hover:underline">
            更多活动
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activities.filter(a => a.status === 'ongoing').slice(0, 3).map(activity => (
            <Link
              key={activity.id}
              to={`/activity/${activity.id}`}
              className="flex gap-3 p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors"
            >
              <img
                src={activity.banner}
                alt={activity.title}
                className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="font-medium text-gray-800 text-sm line-clamp-1 mb-1">
                  {activity.title}
                </div>
                <div className="text-xs text-primary-500 font-medium">
                  {formatPrice(activity.currentAmount)}
                </div>
                <div className="text-xs text-gray-400">
                  {formatNumber(activity.participantCount)}人参与
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
