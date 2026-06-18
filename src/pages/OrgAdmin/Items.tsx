import { useState, useMemo } from 'react';
import { Plus, MoreVertical, Package, Tag, Gavel, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActivityStore } from '../../store/useActivityStore';
import { useUserStore } from '../../store/useUserStore';
import { formatPrice, getItemTypeLabel } from '../../utils';
import CreateItemModal from '../../components/business/CreateItemModal';

export default function OrgItems() {
  const navigate = useNavigate();
  const { items, getActivitiesByOrgId, getActivityById } = useActivityStore();
  const { currentUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sold'>('all');
  const [showCreateItem, setShowCreateItem] = useState(false);

  const orgActivityIds = useMemo(() => {
    if (!currentUser?.orgId) return new Set<string>();
    return new Set(getActivitiesByOrgId(currentUser.orgId).map(a => a.id));
  }, [currentUser, getActivitiesByOrgId]);

  const orgItems = items.filter(item => orgActivityIds.has(item.activityId));

  const filteredItems = activeTab === 'all'
    ? orgItems
    : orgItems.filter(item => 
        activeTab === 'active' ? item.status === 'active' : item.status === 'sold'
      );

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'active', label: '在售中' },
    { key: 'sold', label: '已成交' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">物品管理</h1>
          <p className="text-gray-500 mt-1">管理您的捐赠物品</p>
        </div>
        <button 
          onClick={() => setShowCreateItem(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加物品
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft mb-6">
        <div className="flex border-b border-gray-100">
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
              <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {tab.key === 'all' ? orgItems.length : 
                 tab.key === 'active' ? orgItems.filter(i => i.status === 'active').length :
                 orgItems.filter(i => i.status === 'sold').length}
              </span>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">物品</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">类型</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">起拍价</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">当前价</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">出价次数</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? filteredItems.map(item => {
              const activity = getActivityById(item.activityId);
              return (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-800 text-sm line-clamp-1">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          捐赠者：{item.donorName}
                          {activity && <span className="ml-2">· {activity.title}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{getItemTypeLabel(item.type)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatPrice(item.startPrice)}
                  </td>
                  <td className="px-6 py-4 text-primary-500 font-bold text-sm">
                    {formatPrice(item.currentPrice)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.bidCount}次
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'active' ? 'bg-green-100 text-green-600' :
                      item.status === 'sold' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status === 'active' ? '在售中' :
                       item.status === 'sold' ? '已成交' : '已结束'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/item/${item.id}`)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary-500"
                        title="查看"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="text-gray-400 text-5xl mb-3">📦</div>
                  <p className="text-gray-500 mb-4">暂无物品，赶紧上架第一个捐赠物品吧！</p>
                  <button 
                    onClick={() => setShowCreateItem(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    添加物品
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateItemModal 
        isOpen={showCreateItem} 
        onClose={() => setShowCreateItem(false)} 
      />
    </div>
  );
}
