import { TrendingUp, Users, Package, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useActivityStore } from '../../store/useActivityStore';
import { formatPrice, formatNumber } from '../../utils';
import { mockOrders } from '../../mock';

export default function OrgDashboard() {
  const { activities, items } = useActivityStore();
  
  const orgActivities = activities.filter(a => a.orgId === 'org-1');
  const orgItems = items.filter(item => item.activityId === 'act-1' || item.activityId === 'act-3' || item.activityId === 'act-5');

  const totalFunds = orgActivities.reduce((sum, a) => sum + a.currentAmount, 0);
  const totalParticipants = orgActivities.reduce((sum, a) => sum + a.participantCount, 0);

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
    { label: '筹款总额', value: formatPrice(totalFunds), icon: DollarSign, color: 'text-primary-500', bg: 'bg-primary-50', change: '+12.5%' },
    { label: '参与人数', value: formatNumber(totalParticipants), icon: Users, color: 'text-secondary-500', bg: 'bg-secondary-50', change: '+8.2%' },
    { label: '活动数量', value: orgActivities.length, icon: Calendar, color: 'text-accent-500', bg: 'bg-accent-50', change: '进行中3场' },
    { label: '物品总数', value: orgItems.length, icon: Package, color: 'text-navy-500', bg: 'bg-navy-50', change: '已售12件' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">数据概览</h1>
          <p className="text-gray-500 mt-1">欢迎回来，查看您的公益活动数据</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
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
              <div className="flex items-center gap-1 text-xs text-green-500">
                <TrendingUp className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-semibold text-gray-800 mb-6">筹款趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
              <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6B4A" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FF6B4A" stopOpacity={0}/>
              </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#999" fontSize={12} />
              <YAxis stroke="#999" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#FF6B4A" 
                strokeWidth={2}
                fill="url(#colorIncome)" 
              />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-800 mb-6">竞拍次数</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#999" fontSize={12} />
              <YAxis stroke="#999" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="bids" 
                stroke="#2D6A4F" 
                strokeWidth={2}
                dot={{ fill: '#2D6A4F', r: 4 }}
              />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">进行中的活动</h3>
            <button className="text-sm text-primary-500 flex items-center gap-1 hover:underline">
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {orgActivities.filter(a => a.status === 'ongoing').map(activity => (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-warm-50 rounded-xl">
                <img
                  src={activity.banner}
                  alt={activity.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm truncate">
                    {activity.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatPrice(activity.currentAmount)} / {formatPrice(activity.targetAmount)}
                  </div>
                  <div className="progress-bar h-1 mt-2">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(100, (activity.currentAmount / activity.targetAmount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">最新订单</h3>
            <button className="text-sm text-primary-500 flex items-center gap-1 hover:underline">
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {mockOrders.slice(0, 3).map(order => (
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
                  {formatPrice(order.amount)}
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                order.status === 'completed' ? 'bg-green-100 text-green-600' :
                order.status === 'shipped' ? 'bg-secondary-100 text-secondary-600' :
                'bg-accent-100 text-accent-600'
              }`}>
                {order.status === 'completed' ? '已完成' :
                 order.status === 'shipped' ? '待收货' :
                 order.status === 'paid' ? '待发货' : '待付款'}
              </span>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
