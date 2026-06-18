import { useState } from 'react';
import { Plus, MoreVertical, Calendar, Users, DollarSign } from 'lucide-react';
import { useActivityStore } from '../../store/useActivityStore';
import { formatPrice, formatNumber, getActivityStatusLabel, getActivityStatusColor } from '../../utils';

export default function OrgActivities() {
  const { activities } = useActivityStore();
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming' | 'ended'>('all');

  const orgActivities = activities.filter(a => a.orgId === 'org-1');
  
  const filteredActivities = activeTab === 'all'
    ? orgActivities
    : orgActivities.filter(a => a.status === activeTab);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'ongoing', label: '进行中' },
    { key: 'upcoming', label: '即将开始' },
    { key: 'ended', label: '已结束' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">活动管理</h1>
          <p className="text-gray-500 mt-1">管理您的公益义卖活动</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          创建活动
        </button>
      </div>

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
              <span className="ml-1 text-xs bg-warm-100 px-2 py-0.5 rounded-full">
                {tab.key === 'all' ? orgActivities.length : orgActivities.filter(a => a.status === tab.key).length}
              </span>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="card p-6 hover:shadow-card transition-shadow">
            <div className="flex gap-6">
              <img
                src={activity.banner}
                alt={activity.title}
                className="w-48 h-32 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-lg font-bold text-gray-800 truncate">
                    {activity.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`badge text-xs ${getActivityStatusColor(activity.status)}`}>
                      {getActivityStatusLabel(activity.status)}
                    </span>
                    <button className="p-1 hover:bg-warm-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {activity.description}
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-primary-500" />
                    <span className="text-gray-600">已筹 {formatPrice(activity.currentAmount)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-secondary-500" />
                    <span className="text-gray-600">{formatNumber(activity.participantCount)}人参与</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-accent-500" />
                    <span className="text-gray-600">{activity.itemCount}件物品</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(100, (activity.currentAmount / activity.targetAmount) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>进度 {((activity.currentAmount / activity.targetAmount) * 100).toFixed(1)}%</span>
                    <span>目标 {formatPrice(activity.targetAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-warm-100">
              {activity.status === 'ongoing' && (
                <button className="px-4 py-2 text-sm text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50 transition-colors">
                  管理物品
                </button>
              )}
              {activity.status === 'ended' && (
                <button className="px-4 py-2 text-sm text-secondary-500 border border-secondary-500 rounded-lg hover:bg-secondary-50 transition-colors">
                  查看报告
                </button>
              )}
              <button className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                {activity.status === 'upcoming' ? '立即发布' : '查看详情'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
