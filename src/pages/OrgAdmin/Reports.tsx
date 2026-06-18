import { useMemo } from 'react';
import { FileText, Download, Eye, Calendar, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { mockReceipts, mockFundRecords } from '../../mock';
import { useActivityStore } from '../../store/useActivityStore';
import { useUserStore } from '../../store/useUserStore';
import { formatPrice, formatDate } from '../../utils';

export default function OrgReports() {
  const { activities, getActivitiesByOrgId } = useActivityStore();
  const { currentUser } = useUserStore();
  
  const endedActivities = useMemo(() => {
    if (!currentUser?.orgId) return [];
    return getActivitiesByOrgId(currentUser.orgId).filter(a => a.status === 'ended');
  }, [currentUser, activities, getActivitiesByOrgId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">公示报告</h1>
          <p className="text-gray-500 mt-1">活动结束后生成公示报告</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{endedActivities.length}</div>
              <div className="text-sm text-gray-500">已完成活动</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {formatPrice(endedActivities.reduce((sum, a) => sum + a.currentAmount, 0))}
              </div>
              <div className="text-sm text-gray-500">累计筹款</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-secondary-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{mockReceipts.length}</div>
              <div className="text-sm text-gray-500">捐赠收据</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">已结束活动</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {endedActivities.map(activity => {
            const receipts = mockReceipts.filter(r => r.activityId === activity.id);
            const records = mockFundRecords.filter(r => r.activityId === activity.id);
            const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
            const totalExpense = Math.abs(records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0));

            return (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={activity.banner}
                    alt={activity.title}
                    className="w-32 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">{activity.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(activity.endTime)}
                      </span>
                      <span>筹款 {formatPrice(activity.currentAmount)}</span>
                      <span>{activity.participantCount}人参与</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      查看报告
                    </button>
                    <button className="px-4 py-2 text-sm bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                  </div>
                </div>

                {receipts.length > 0 && (
                  <div className="bg-warm-50 rounded-xl p-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">捐赠收据</div>
                    <div className="flex gap-4">
                      {receipts.map(receipt => (
                        <div key={receipt.id} className="flex items-center gap-3 bg-white rounded-lg p-2">
                          <img
                            src={receipt.imageUrl}
                            alt={receipt.title}
                            className="w-16 h-12 rounded object-cover"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-800">{receipt.title}</div>
                            <div className="text-xs text-primary-500 font-medium">
                              {formatPrice(receipt.amount)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-500">+{formatPrice(totalIncome)}</div>
                    <div className="text-xs text-gray-500">总收入</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-500">-{formatPrice(totalExpense)}</div>
                    <div className="text-xs text-gray-500">运营成本</div>
                  </div>
                  <div className="text-center p-3 bg-primary-50 rounded-lg">
                    <div className="text-lg font-bold text-primary-500">
                      {formatPrice(totalIncome - totalExpense)}
                    </div>
                    <div className="text-xs text-gray-500">实际捐赠</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {endedActivities.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无已结束的活动</p>
          </div>
        )}
      </div>
    </div>
  );
}
