import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Package, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useActivityStore } from '../../store/useActivityStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useUserStore } from '../../store/useUserStore';
import { formatPrice, formatNumber, formatDateTime } from '../../utils';
import CreateActivityModal from '../../components/business/CreateActivityModal';

export default function OrgDashboard() {
  const navigate = useNavigate();
  const { activities, items, getActivitiesByOrgId } = useActivityStore();
  const { orders, getOrdersByOrgActivities } = useOrderStore();
  const { currentUser } = useUserStore();
  const [showCreateActivity, setShowCreateActivity] = useState(false);

  const orgActivities = useMemo(() => {
    if (!currentUser?.orgId) return [];
    return getActivitiesByOrgId(currentUser.orgId);
  }, [currentUser, activities, getActivitiesByOrgId]);

  const activityIdSet = useMemo(() => new Set(orgActivities.map(a => a.id)), [orgActivities]);
  const orgItems = useMemo(() => items.filter(i => activityIdSet.has(i.activityId)), [items, activityIdSet]);
  const orgOrders = useMemo(() => {
    return orgActivities.length > 0 ? getOrdersByOrgActivities(orgActivities.map(a => a.id)) : [];
  }, [orgActivities, orders, getOrdersByOrgActivities]);

  const totalFunds = orgActivities.reduce((sum, a) => sum + a.currentAmount, 0);
  const totalParticipants = orgActivities.reduce((sum, a) => sum + a.participantCount, 0);
  const ongoingCount = orgActivities.filter(a => a.status === 'ongoing').length;
  const soldItemsCount = orgItems.filter(i => i.status === 'sold').length;

  const chartData = [
    { date: '周一', income: 8500, bids: 45 },
    { date: '周二', income: 12000, bids: 62 },
    { date: '周三', income: 9800, bids: 54 },
    { date: '周四', income: 15600, bids: 78 },
    { date: '周五', income: 13200, bids: 68 },
    { date: '周六', income: 18900, bids: 92 },
    { date: '周日', income: 16500, bids: 85 },
  ];

  const stats = [
    { label: '筹款总额', value: formatPrice(totalFunds), icon: DollarSign, color: 'text-primary-500', bg: 'bg-primary-50', change: `进行中${ongoingCount}场` },
    { label: '参与人数', value: formatNumber(totalParticipants), icon: Users, color: 'text-secondary-500', bg: 'bg-secondary-50', change: '+持续增长' },
    { label: '活动数量', value: orgActivities.length, icon: Calendar, color: 'text-accent-500', bg: 'bg-accent-50', change: `进行中${ongoingCount}场` },
    { label: '物品总数', value: orgItems.length, icon: Package, color: 'text-navy-500', bg: 'bg-navy-50', change: `已售${soldItemsCount}件` },
  ];

  const latestOrders = orgOrders.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">数据概览</h1>
          <p className="text-gray-500 mt-1">欢迎回来，查看您的公益活动数据</p>
        </div>
        <button 
          onClick={() => setShowCreateActivity(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          创建活动
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={stat.label} className="card p-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">筹款趋势</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500 font-medium">+12.5% 较上周</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B5B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF6B5B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#FF6B5B" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">竞拍活跃度</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500 font-medium">+8.2% 较上周</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="bids" stroke="#0EA666" strokeWidth={3} dot={{ r: 4, fill: '#0EA666' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">进行中活动</h3>
            <button 
              onClick={() => navigate('/org/activities')}
              className="text-sm text-primary-500 flex items-center gap-1 hover:underline"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {orgActivities.filter(a => a.status === 'ongoing').slice(0, 3).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无进行中活动</p>
              </div>
            ) : (
              orgActivities.filter(a => a.status === 'ongoing').slice(0, 3).map(activity => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/activity/${activity.id}`)}
                >
                  <img
                    src={activity.banner}
                    alt={activity.title}
                    className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm truncate mb-1">
                      {activity.title}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {formatPrice(activity.currentAmount)} / {formatPrice(activity.targetAmount)}
                    </div>
                    <div className="progress-bar h-1">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(100, (activity.currentAmount / activity.targetAmount) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">最新订单</h3>
            <button 
              onClick={() => navigate('/org/orders')}
              className="text-sm text-primary-500 flex items-center gap-1 hover:underline"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {latestOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无订单</p>
              </div>
            ) : (
              latestOrders.map(order => (
                <div key={order.id} className="flex items-center gap-4 p-3 bg-warm-50 rounded-xl">
                  <img
                    src={order.itemImage}
                    alt={order.itemName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm truncate">
                      {order.itemName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatPrice(order.amount)} · {formatDateTime(order.createdAt)}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-600' :
                    order.status === 'shipped' ? 'bg-secondary-100 text-secondary-600' :
                    order.status === 'paid' ? 'bg-primary-100 text-primary-600' :
                    'bg-accent-100 text-accent-600'
                  }`}>
                    {order.status === 'completed' ? '已完成' :
                     order.status === 'shipped' ? '待收货' :
                     order.status === 'paid' ? '待发货' : '待付款'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <CreateActivityModal 
        isOpen={showCreateActivity} 
        onClose={() => setShowCreateActivity(false)} 
      />
    </div>
  );
}
