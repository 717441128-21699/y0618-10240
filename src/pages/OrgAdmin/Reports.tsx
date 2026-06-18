import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, Calendar, TrendingUp, CheckCircle, FileEdit, Calculator } from 'lucide-react';
import { useActivityStore } from '../../store/useActivityStore';
import { useUserStore } from '../../store/useUserStore';
import { formatPrice, formatDate, formatDateTime } from '../../utils';
import ReceiptModal from '../../components/business/ReceiptModal';

export default function OrgReports() {
  const navigate = useNavigate();
  const { activities, getActivitiesByOrgId, getReceiptsByActivityId, getFundRecordsByActivityId } = useActivityStore();
  const { currentUser } = useUserStore();
  const [receiptModalActivity, setReceiptModalActivity] = useState<{ id: string; title: string; orgName: string; projectName: string } | null>(null);
  
  const endedActivities = useMemo(() => {
    if (!currentUser?.orgId) return [];
    return getActivitiesByOrgId(currentUser.orgId).filter(a => a.status === 'ended');
  }, [currentUser, activities, getActivitiesByOrgId]);

  const totalDonationAmount = endedActivities.reduce((sum, a) => sum + (a.finalDonationAmount || 0), 0);
  const totalReceipts = endedActivities.reduce((sum, a) => sum + getReceiptsByActivityId(a.id).length, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">公示报告</h1>
          <p className="text-gray-500 mt-1">活动结束后结算并生成公示报告</p>
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
          <div className="text-xs text-gray-400">
            已结算 {endedActivities.filter(a => a.settled).length} 场 · 待结算 {endedActivities.filter(a => !a.settled).length} 场
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {formatPrice(totalDonationAmount)}
              </div>
              <div className="text-sm text-gray-500">累计捐赠</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            筹款总额 {formatPrice(endedActivities.reduce((sum, a) => sum + a.currentAmount, 0))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{totalReceipts}</div>
              <div className="text-sm text-gray-500">捐赠收据</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold text-gray-800">已结束活动</h2>
          <div className="text-sm text-gray-500">
            共 {endedActivities.length} 场活动
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {endedActivities.map(activity => {
            const receipts = getReceiptsByActivityId(activity.id);
            const records = getFundRecordsByActivityId(activity.id);
            const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
            const totalExpense = Math.abs(records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0));

            return (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4 mb-4 flex-wrap">
                  <img
                    src={activity.banner}
                    alt={activity.title}
                    className="w-32 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-gray-800">{activity.title}</h3>
                      {activity.settled ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-600">
                          <CheckCircle className="w-3 h-3" />
                          已结算
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent-100 text-accent-600">
                          <Calculator className="w-3 h-3" />
                          待结算
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(activity.endTime)}
                      </span>
                      <span>筹款 {formatPrice(activity.currentAmount)}</span>
                      <span>{activity.participantCount}人参与</span>
                      {activity.settlementAt && (
                        <span>结算 {formatDateTime(activity.settlementAt)}</span>
                      )}
                    </div>
                    {activity.settled && activity.operationCostRate !== undefined && (
                      <div className="text-xs text-gray-400 mt-1">
                        运营成本 {activity.operationCostRate}% · 扣除 {formatPrice(activity.operationCostAmount || 0)} · 捐赠 {formatPrice(activity.finalDonationAmount || 0)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {!activity.settled && (
                      <button 
                        onClick={() => navigate(`/org/settlement/${activity.id}`)}
                        className="px-4 py-2 text-sm bg-accent-500 text-white rounded-lg hover:bg-accent-600 flex items-center gap-1"
                      >
                        <Calculator className="w-4 h-4" />
                        去结算
                      </button>
                    )}
                    {activity.settled && (
                      <button
                        onClick={() => setReceiptModalActivity({
                          id: activity.id,
                          title: activity.title,
                          orgName: activity.orgName,
                          projectName: activity.projectName,
                        })}
                        className="px-4 py-2 text-sm text-secondary-600 border border-secondary-500 rounded-lg hover:bg-secondary-50 flex items-center gap-1"
                      >
                        <FileEdit className="w-4 h-4" />
                        管理收据
                      </button>
                    )}
                    <button 
                      onClick={() => navigate(`/activity/${activity.id}`)}
                      className="px-4 py-2 text-sm text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      查看公示
                    </button>
                  </div>
                </div>

                {activity.settled && (
                  <>
                    {receipts.length > 0 && (
                      <div className="bg-warm-50 rounded-xl p-4 mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                          <span>捐赠收据 ({receipts.length}张)</span>
                          <button
                            onClick={() => setReceiptModalActivity({
                              id: activity.id,
                              title: activity.title,
                              orgName: activity.orgName,
                              projectName: activity.projectName,
                            })}
                            className="text-xs text-secondary-500 hover:underline flex items-center gap-1"
                          >
                            <FileEdit className="w-3 h-3" />
                            管理
                          </button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {receipts.map(receipt => (
                            <div key={receipt.id} className="flex items-center gap-3 bg-white rounded-lg p-2 flex-shrink-0">
                              <img
                                src={receipt.imageUrl}
                                alt={receipt.title}
                                className="w-16 h-12 rounded object-cover"
                              />
                              <div className="pr-2">
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

                    {records.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-500">+{formatPrice(totalIncome || activity.currentAmount)}</div>
                          <div className="text-xs text-gray-500">总收入</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-500">-{formatPrice(totalExpense || (activity.operationCostAmount || 0))}</div>
                          <div className="text-xs text-gray-500">运营成本</div>
                        </div>
                        <div className="text-center p-3 bg-secondary-50 rounded-lg">
                          <div className="text-lg font-bold text-secondary-500">
                            {formatPrice(activity.finalDonationAmount || ((totalIncome || activity.currentAmount) - (totalExpense || 0)))}
                          </div>
                          <div className="text-xs text-gray-500">实际捐赠</div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!activity.settled && (
                  <div className="p-4 bg-accent-50 rounded-xl border border-accent-200 text-center">
                    <Calculator className="w-8 h-8 mx-auto mb-2 text-accent-500" />
                    <p className="text-sm text-gray-600 mb-3">活动已结束，请先完成结算以生成公示报告和资金明细</p>
                    <button
                      onClick={() => navigate(`/org/settlement/${activity.id}`)}
                      className="btn-primary text-sm px-6 py-2"
                    >
                      前往结算
                    </button>
                  </div>
                )}
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

      {receiptModalActivity && (
        <ReceiptModal
          isOpen={!!receiptModalActivity}
          onClose={() => setReceiptModalActivity(null)}
          activityId={receiptModalActivity.id}
          activityTitle={receiptModalActivity.title}
          orgName={receiptModalActivity.orgName}
          projectName={receiptModalActivity.projectName}
        />
      )}
    </div>
  );
}
