import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, TrendingUp, TrendingDown, FileText, 
  Calendar, Building2, Eye, ChevronRight, DollarSign
} from 'lucide-react';
import { mockReceipts, mockFundRecords, mockActivities } from '../../mock';
import { formatPrice, formatDate, formatNumber } from '../../utils';

export default function Transparency() {
  const [activeTab, setActiveTab] = useState<'receipts' | 'details'>('receipts');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const endedActivities = mockActivities.filter(a => a.status === 'ended');
  const totalDonation = mockReceipts.reduce((sum, r) => sum + r.amount, 0);
  const totalIncome = mockActivities.reduce((sum, a) => sum + a.currentAmount, 0);

  const selectedReceipts = selectedActivity 
    ? mockReceipts.filter(r => r.activityId === selectedActivity)
    : mockReceipts;

  const selectedFundRecords = selectedActivity
    ? mockFundRecords.filter(r => r.activityId === selectedActivity)
    : mockFundRecords;

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="bg-gradient-warm py-16 text-white">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">透明公示</h1>
              <p className="text-white/80 mt-1">每一笔善款，都清晰可见</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="text-sm text-white/70 mb-1">累计筹款</div>
              <div className="text-2xl font-bold">{formatPrice(totalIncome)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="text-sm text-white/70 mb-1">累计捐赠</div>
              <div className="text-2xl font-bold">{formatPrice(totalDonation)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="text-sm text-white/70 mb-1">已公示活动</div>
              <div className="text-2xl font-bold">{endedActivities.length}场</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="text-sm text-white/70 mb-1">捐赠项目</div>
              <div className="text-2xl font-bold">6个</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10 -mt-6">
        <div className="card p-6 mb-8">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm text-gray-500">按活动筛选：</span>
            <button
              onClick={() => setSelectedActivity(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedActivity
                  ? 'bg-primary-500 text-white'
                  : 'bg-warm-100 text-gray-600 hover:bg-warm-200'
              }`}
            >
              全部
            </button>
            {endedActivities.map(activity => (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedActivity === activity.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-warm-100 text-gray-600 hover:bg-warm-200'
                }`}
              >
                {activity.title.substring(0, 10)}...
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex border-b border-warm-100">
                <button
                  onClick={() => setActiveTab('receipts')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors relative flex items-center justify-center gap-2 ${
                    activeTab === 'receipts'
                      ? 'text-primary-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  捐赠收据
                  {activeTab === 'receipts' && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors relative flex items-center justify-center gap-2 ${
                    activeTab === 'details'
                      ? 'text-primary-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  资金明细
                  {activeTab === 'details' && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'receipts' ? (
                  <div className="space-y-4">
                    {selectedReceipts.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>暂无捐赠收据</p>
                      </div>
                    ) : (
                      selectedReceipts.map(receipt => (
                        <div 
                          key={receipt.id}
                          className="flex gap-4 p-4 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors cursor-pointer"
                        >
                          <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-warm-200">
                            <img
                              src={receipt.imageUrl}
                              alt={receipt.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 mb-1">
                              {receipt.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <Building2 className="w-4 h-4" />
                              <span>{receipt.orgName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(receipt.donateTime)}</span>
                              <span className="text-primary-500 font-medium ml-2">
                                {formatPrice(receipt.amount)}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-400 line-clamp-1">
                              捐赠项目：{receipt.project}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button className="text-sm text-primary-500 flex items-center gap-1 hover:underline">
                              <Eye className="w-4 h-4" />
                              查看
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedFundRecords.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>暂无资金明细</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-primary-500" />
                            </div>
                            <span className="font-medium text-gray-800">总收入</span>
                          </div>
                          <span className="text-xl font-bold text-primary-500">
                            +{formatPrice(selectedFundRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0))}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <TrendingDown className="w-5 h-5 text-red-500" />
                            </div>
                            <span className="font-medium text-gray-800">总支出</span>
                          </div>
                          <span className="text-xl font-bold text-red-500">
                            -{formatPrice(Math.abs(selectedFundRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0)))}
                          </span>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium text-gray-800 mb-3">明细列表</h4>
                          <div className="space-y-2">
                            {selectedFundRecords.map(record => (
                              <div 
                                key={record.id}
                                className="flex items-center justify-between p-3 bg-warm-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    record.type === 'income' ? 'bg-green-100' : 'bg-orange-100'
                                  }`}>
                                    {record.type === 'income' ? (
                                      <TrendingUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <TrendingDown className="w-4 h-4 text-orange-500" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-800">
                                      {record.title}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatDate(record.createdAt)}
                                    </div>
                                  </div>
                                </div>
                                <span className={`font-medium ${
                                  record.type === 'income' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  {record.type === 'income' ? '+' : ''}{formatPrice(record.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 mb-4">透明承诺</h3>
              <div className="space-y-4">
                {[
                  { icon: '🔍', title: '全程公开', desc: '每一笔资金流向都可追溯查询' },
                  { icon: '📄', title: '官方收据', desc: '所有捐赠均有正规机构收据' },
                  { icon: '✅', title: '定期公示', desc: '活动结束后7个工作日内公示' },
                  { icon: '🤝', title: '第三方监督', desc: '接受社会各界监督检查' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 mb-4">已结束活动</h3>
              <div className="space-y-3">
                {endedActivities.map(activity => (
                  <Link
                    key={activity.id}
                    to={`/activity/${activity.id}`}
                    className="flex items-center gap-3 p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors"
                  >
                    <img
                      src={activity.banner}
                      alt={activity.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 text-sm line-clamp-1">
                        {activity.title}
                      </div>
                      <div className="text-xs text-primary-500 font-medium">
                        已筹 {formatPrice(activity.currentAmount)}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
