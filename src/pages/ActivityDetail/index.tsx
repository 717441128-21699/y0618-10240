import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Clock, Target, Share2, Heart, ChevronRight, Building2, FileText, DollarSign, Calculator, CheckCircle, ShoppingBag, Gavel } from 'lucide-react';
import ItemCard from '../../components/business/ItemCard';
import CountdownTimer from '../../components/common/CountdownTimer';
import { useActivityStore } from '../../store/useActivityStore';
import { useOrderStore } from '../../store/useOrderStore';
import { formatPrice, formatNumber, formatDateTime, getActivityStatusLabel, getActivityStatusColor, getItemTypeLabel } from '../../utils';

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const { getActivityById, getItemsByActivityId, getReceiptsByActivityId, getFundRecordsByActivityId, getBidsByItemId } = useActivityStore();
  const { orders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'all' | 'auction' | 'buynow' | 'transparency'>('all');
  const [isFollowed, setIsFollowed] = useState(false);

  const activity = getActivityById(id || '');
  const items = getItemsByActivityId(id || '');
  const receipts = activity ? getReceiptsByActivityId(activity.id) : [];
  const fundRecords = activity ? getFundRecordsByActivityId(activity.id) : [];

  const settlementItems = useMemo(() => {
    if (!activity) return [];
    const activityOrders = orders.filter(o => o.activityId === activity.id && (o.status === 'paid' || o.status === 'shipped' || o.status === 'completed'));
    return activityOrders.map(order => {
      const item = items.find(i => i.id === order.itemId);
      return { order, item, itemName: item?.name || order.itemName, itemImage: item?.image || order.itemImage };
    });
  }, [activity, orders, items]);

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-xl font-medium text-gray-600 mb-2">活动不存在</h2>
          <Link to="/activities" className="text-primary-500 hover:underline">
            返回活动列表
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.min(100, (activity.currentAmount / activity.targetAmount) * 100);

  const filteredItems = items.filter(item => {
    if (activeTab === 'auction') return !item.buyNowPrice || item.status === 'active';
    if (activeTab === 'buynow') return item.buyNowPrice !== undefined;
    return true;
  });

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={activity.banner}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <div className="container">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`badge ${getActivityStatusColor(activity.status)}`}>
                {getActivityStatusLabel(activity.status)}
              </span>
              {activity.settled && (
                <span className="badge bg-secondary-500/90 text-white flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  已结算公示
                </span>
              )}
              {activity.status === 'ongoing' && (
                <CountdownTimer endTime={activity.endTime} size="sm" />
              )}
            </div>
            <h1 className="font-serif text-2xl md:text-4xl font-bold mb-3">{activity.title}</h1>
            <div className="flex items-center gap-3">
              <img src={activity.orgLogo} alt={activity.orgName} className="w-8 h-8 rounded-full bg-white/20" />
              <span className="text-white/90">{activity.orgName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container -mt-16 relative z-10">
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center p-4 bg-primary-50 rounded-xl">
              <div className="text-2xl md:text-3xl font-bold text-primary-500 mb-1">
                {formatPrice(activity.currentAmount)}
              </div>
              <div className="text-sm text-gray-500">已筹金额</div>
            </div>
            <div className="text-center p-4 bg-secondary-50 rounded-xl">
              <div className="text-2xl md:text-3xl font-bold text-secondary-500 mb-1">
                {formatNumber(activity.participantCount)}
              </div>
              <div className="text-sm text-gray-500">参与人数</div>
            </div>
            <div className="text-center p-4 bg-accent-50 rounded-xl">
              <div className="text-2xl md:text-3xl font-bold text-accent-500 mb-1">
                {activity.itemCount}
              </div>
              <div className="text-sm text-gray-500">捐赠物品</div>
            </div>
            <div className="text-center p-4 bg-navy-50 rounded-xl">
              <div className="text-2xl md:text-3xl font-bold text-navy-500 mb-1">
                {progress.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500">筹款进度</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">筹款进度</span>
              <span className="text-gray-500">目标 {formatPrice(activity.targetAmount)}</span>
            </div>
            <div className="progress-bar h-3">
              <div 
                className="progress-fill h-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {activity.settled && activity.finalDonationAmount !== undefined && (
            <div className="mt-6 p-5 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl border border-secondary-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">成交总额</div>
                    <div className="text-lg font-bold text-gray-800">{formatPrice(activity.currentAmount)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-accent-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">运营成本 ({activity.operationCostRate}%)</div>
                    <div className="text-lg font-bold text-gray-800">{formatPrice(activity.operationCostAmount || 0)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-secondary-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">已捐赠至公益项目</div>
                    <div className="text-lg font-bold text-secondary-600">{formatPrice(activity.finalDonationAmount)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsFollowed(!isFollowed)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                isFollowed 
                  ? 'bg-primary-100 text-primary-500' 
                  : 'bg-warm-100 text-gray-600 hover:bg-warm-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFollowed ? 'fill-primary-500' : ''}`} />
              {isFollowed ? '已关注' : '关注活动'}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-warm-100 text-gray-600 rounded-xl font-medium hover:bg-warm-200 transition-all">
              <Share2 className="w-5 h-5" />
              分享活动
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <div className="border-b border-warm-100">
                <div className="flex overflow-x-auto">
                  {[
                    { key: 'all', label: '全部物品', icon: ShoppingBag },
                    { key: 'auction', label: '竞拍物品', icon: Gavel },
                    { key: 'buynow', label: '即时购买', icon: DollarSign },
                    { key: 'transparency', label: '资金透明', icon: FileText },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap flex items-center gap-1.5 ${
                        activeTab === tab.key
                          ? 'text-primary-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {activeTab === tab.key && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500 rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'transparency' ? (
                  <div className="space-y-8">
                    {!activity.settled ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">活动尚未结算</h3>
                        <p className="text-gray-500">资金透明公示将在活动结束并完成结算后展示</p>
                      </div>
                    ) : (
                      <>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-secondary-500" />
                        资金去向说明
                      </h3>
                      <div className="bg-warm-50 rounded-xl p-5 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">成交总额</span>
                          <span className="font-medium text-gray-800">{formatPrice(activity.currentAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">减：运营成本（{activity.operationCostRate}%）</span>
                          <span className="font-medium text-accent-600">-{formatPrice(activity.operationCostAmount || 0)}</span>
                        </div>
                        <div className="h-px bg-warm-200" />
                        <div className="flex justify-between">
                          <span className="text-gray-800 font-medium">捐赠至公益项目：{activity.projectName}</span>
                          <span className="font-bold text-secondary-600 text-lg">{formatPrice(activity.finalDonationAmount || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {fundRecords.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-gray-500" />
                          资金明细
                        </h3>
                        <div className="divide-y divide-gray-100 bg-white rounded-xl border border-warm-200">
                          {fundRecords.map(record => (
                            <div key={record.id} className="px-5 py-3 flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm text-gray-800">{record.title}</div>
                                <div className="text-xs text-gray-400">{record.description}</div>
                                <div className="text-xs text-gray-400">{formatDateTime(record.createdAt)}</div>
                              </div>
                              <div className={`font-bold text-sm ${record.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                {record.type === 'income' ? '+' : '-'}{formatPrice(record.amount)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {settlementItems.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5 text-gray-500" />
                          成交明细 & 公益项目去向
                        </h3>
                        <div className="space-y-3">
                          {settlementItems.map(({ order, item, itemName, itemImage }) => {
                            const opCost = Math.round(order.amount * (activity.operationCostRate || 5) / 100 * 100) / 100;
                            const donation = order.amount - opCost;
                            return (
                              <div key={order.id} className="flex gap-4 p-4 bg-white border border-warm-200 rounded-xl hover:border-primary-200 transition-colors">
                                <img src={itemImage} alt={itemName} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-800">{itemName}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {item ? getItemTypeLabel(item.type || 'physical') : getItemTypeLabel(order.itemType)} · {order.type === 'auction' ? '竞拍' : '即时购'}
                                  </div>
                                  <div className="text-xs text-secondary-600 mt-1">
                                    成交价：<span className="font-medium">{formatPrice(order.amount)}</span>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-xs text-gray-500">捐赠至</div>
                                  <div className="text-xs font-medium text-secondary-600">{activity.projectName}</div>
                                  <div className="text-sm font-bold text-secondary-500">{formatPrice(donation)}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {receipts.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-gray-500" />
                          捐赠收据
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {receipts.map(receipt => (
                            <div key={receipt.id} className="bg-white border border-warm-200 rounded-xl overflow-hidden hover:border-primary-300 transition-colors">
                              <img src={receipt.imageUrl} alt={receipt.title} className="w-full h-40 object-cover" />
                              <div className="p-4">
                                <div className="font-medium text-gray-800 mb-1">{receipt.title}</div>
                                <div className="text-sm text-gray-500 mb-2">捐赠项目：{receipt.project}</div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-400">捐赠机构：{receipt.orgName}</span>
                                  <span className="text-lg font-bold text-primary-500">{formatPrice(receipt.amount)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                      </>
                    )}
                  </div>
            ) : (
              <>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p>暂无物品</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredItems.map(item => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

            <div className="card p-6 mb-8">
              <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">活动介绍</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{activity.description}</p>
              <div className="bg-warm-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-secondary-500" />
                  <span className="font-medium text-gray-800">公益项目：{activity.projectName}</span>
                </div>
                <p className="text-sm text-gray-600">{activity.projectDesc}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-500" />
                主办方
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={activity.orgLogo} alt={activity.orgName} className="w-14 h-14 rounded-xl bg-warm-100" />
                <div>
                  <div className="font-medium text-gray-800">{activity.orgName}</div>
                  <div className="text-sm text-gray-500">认证公益机构</div>
                </div>
              </div>
              <button className="w-full py-2 border border-primary-500 text-primary-500 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors">
                查看机构主页
              </button>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                活动时间
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">开始时间</span>
                  <span className="text-gray-800">{activity.startTime ? new Date(activity.startTime).toLocaleString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">结束时间</span>
                  <span className="text-gray-800">{activity.endTime ? new Date(activity.endTime).toLocaleString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                </div>
                {activity.settlementAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">结算时间</span>
                    <span className="text-gray-800">{formatDateTime(activity.settlementAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 mb-4">参与排行</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(rank => (
                  <div key={rank} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      rank === 1 ? 'bg-accent-400 text-white' :
                      rank === 2 ? 'bg-gray-300 text-white' :
                      'bg-amber-700 text-white'
                    }`}>
                      {rank}
                    </div>
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rank}`} 
                      alt="" 
                      className="w-8 h-8 rounded-full bg-warm-100"
                    />
                    <span className="flex-1 text-sm text-gray-700">爱心人士{rank}</span>
                    <span className="text-sm font-medium text-primary-500">
                      ¥{(5000 - rank * 1000).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-primary-500 flex items-center justify-center gap-1">
                查看完整榜单
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
