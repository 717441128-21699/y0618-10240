import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import ActivityCard from '../../components/business/ActivityCard';
import { useActivityStore } from '../../store/useActivityStore';

export default function ActivityList() {
  const [searchParams] = useSearchParams();
  const { activities } = useActivityStore();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const statusOptions = [
    { value: 'all', label: '全部活动' },
    { value: 'ongoing', label: '进行中' },
    { value: 'upcoming', label: '即将开始' },
    { value: 'ended', label: '已结束' },
  ];

  const sortOptions = [
    { value: 'newest', label: '最新发布' },
    { value: 'most_participants', label: '参与最多' },
    { value: 'most_funded', label: '筹款最多' },
    { value: 'ending_soon', label: '即将结束' },
  ];

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    if (searchQuery) {
      result = result.filter(
        a => a.title.includes(searchQuery) || a.description.includes(searchQuery) || a.orgName.includes(searchQuery)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter);
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'most_participants':
        result.sort((a, b) => b.participantCount - a.participantCount);
        break;
      case 'most_funded':
        result.sort((a, b) => b.currentAmount - a.currentAmount);
        break;
      case 'ending_soon':
        result.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
        break;
    }

    return result;
  }, [activities, searchQuery, statusFilter, sortBy]);

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="bg-gradient-warm py-12 text-white">
        <div className="container">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">义卖活动</h1>
          <p className="text-white/80">发现更多公益活动，用爱心传递温暖</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索活动名称、机构..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-warm-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    statusFilter === option.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-warm-100 text-gray-600 hover:bg-warm-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-warm-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">排序：</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-warm-50 border-0 text-sm text-gray-600 focus:ring-0 rounded-lg"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500 mr-2">共 {filteredActivities.length} 个活动</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-500' : 'text-gray-400'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-500' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">暂无相关活动</h3>
            <p className="text-gray-400">试试其他关键词或筛选条件吧</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="card p-4 flex gap-4 animate-fade-in-up hover:shadow-hover transition-all cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => (window.location.href = `/activity/${activity.id}`)}
              >
                <img
                  src={activity.banner}
                  alt={activity.title}
                  className="w-48 h-32 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-gray-800 mb-1">
                        {activity.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <img src={activity.orgLogo} alt={activity.orgName} className="w-5 h-5 rounded-full" />
                        <span>{activity.orgName}</span>
                        <span>·</span>
                        <span>{activity.projectName}</span>
                      </div>
                    </div>
                    <span className={`badge text-xs ${
                      activity.status === 'ongoing' ? 'bg-secondary-100 text-secondary-600' :
                      activity.status === 'upcoming' ? 'bg-navy-100 text-navy-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {activity.status === 'ongoing' ? '进行中' : activity.status === 'upcoming' ? '即将开始' : '已结束'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{activity.description}</p>
                  <div className="flex items-end justify-between">
                    <div className="flex-1 mr-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-primary-500 font-medium">已筹 {activity.currentAmount.toLocaleString()}元</span>
                        <span className="text-gray-400">目标 {activity.targetAmount.toLocaleString()}元</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min(100, (activity.currentAmount / activity.targetAmount) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{activity.participantCount.toLocaleString()}人参与</div>
                      <div>{activity.itemCount}件拍品</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
