import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Calculator, DollarSign, Users, Package, CheckCircle, AlertTriangle, Check, FileText, Eye
} from 'lucide-react';
import { useActivityStore } from '../../store/useActivityStore';
import { formatPrice, formatDateTime, getOrderStatusLabel, getOrderStatusColor } from '../../utils';
import type { ActivityReport } from '../../types';

export default function OrgSettlement() {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { getActivityById, getReport, settleActivity, receipts } = useActivityStore();

  const activity = activityId ? getActivityById(activityId) : undefined;
  const report: ActivityReport | null = useMemo(() => {
    if (!activityId) return null;
    try {
      return getReport(activityId);
    } catch {
        return null;
    }
  }, [activityId, receipts]);

  const [operationCostRate, setOperationCostRate] = useState(5);
  const [isSettling, setIsSettling] = useState(false);

  if (!activity || !report) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-xl font-medium text-gray-600 mb-2">活动不存在</h2>
          <Link to="/org/activities" className="text-primary-500 hover:underline">
            返回活动管理
          </Link>
        </div>
      </div>
    );
  }

  const opCost = Math.round(report.totalIncome * operationCostRate / 100 * 100) / 100;
  const donation = report.totalIncome - opCost;

  const handleSettle = async () => {
    if (!activityId) return;
    setIsSettling(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = settleActivity(activityId, operationCostRate);
    setIsSettling(false);
    if (ok) {
      navigate(`/activity/${activityId}`, { replace: true });
    }
  };

  const canSettle = activity.status === 'ended' && !activity.settled;

  const statusLabels: Record<string, { text: string; icon: any; color: string }> = {
    upcoming: { text: '未开始', icon: AlertTriangle, color: 'bg-accent-50 text-accent-500' },
    ongoing: { text: '进行中', icon: AlertTriangle, color: 'bg-green-50 text-green-500' },
    ended: { text: '已结束', icon: CheckCircle, color: 'bg-navy-50 text-navy-500' },
  };

  const statusInfo = statusLabels[activity.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div>
      <div className="mb-6">
      <button
        onClick={() => navigate('/org/activities')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        返回活动管理
      </button>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800 mb-2">
            活动结算
          </h1>
          <p className="text-gray-500">
            {activity.title}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
            <StatusIcon className="w-4 h-4" />
            {statusInfo.text}
          </span>
          {activity.settled && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-secondary-50 text-secondary-600">
              <CheckCircle className="w-4 h-4" />
              已结算
            </span>
          )}
        </div>
      </div>
    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-secondary-500" />
          </div>
          <span className="text-sm text-gray-500">成交总额</span>
        </div>
          <div className="text-2xl font-bold text-gray-800">
            {formatPrice(report.totalIncome)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            已收款 {formatPrice(report.totalPaidIncome)} · 待收款 {formatPrice(report.totalUnpaid)}
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-accent-500" />
          </div>
          <span className="text-sm text-gray-500">运营成本 {activity.settled ? `(${activity.operationCostRate}%)` : `(${operationCostRate}%)`}</span>
        </div>
          <div className="text-2xl font-bold text-gray-800">
          {formatPrice(activity.settled ? (activity.operationCostAmount || 0) : opCost)}
        </div>
          {!activity.settled && (
          <input
            type="range"
            min={1}
            max={20}
            value={operationCostRate}
            onChange={e => setOperationCostRate(Number(e.target.value))}
            className="w-full mt-2 accent-primary-500"
          />
        )}
      </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <Check className="w-5 h-5 text-primary-500" />
          </div>
          <span className="text-sm text-gray-500">预计捐赠</span>
        </div>
          <div className="text-2xl font-bold text-primary-500">
            {formatPrice(activity.settled ? (activity.finalDonationAmount || 0) : donation)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            捐赠至：{activity.projectName}
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
            <Package className="w-5 h-5 text-navy-500" />
          </div>
          <span className="text-sm text-gray-500">成交物品</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {report.soldCount} / {report.itemCount}
        </div>
          <div className="text-xs text-gray-400 mt-1">
            共 {report.participantCount} 人参与 · {report.bidCount} 次出价
          </div>
        </div>
      </div>

      {canSettle && (
        <div className="card p-6 mb-6 bg-gradient-warm text-center border-none">
          <div className="max-w-md mx-auto">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-accent-500" />
          <h3 className="font-semibold text-gray-800 mb-2">确认结算</h3>
          <p className="text-gray-600 mb-4 text-sm">
            结算后将生成正式的资金公示报告，所有数据将不可更改。确认结算后，活动详情页将展示完整的资金去向和捐赠收据。
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/org/activities')}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-warm-50"
            >
              返回
            </button>
            <button
              onClick={handleSettle}
              disabled={isSettling}
              className="btn-primary px-8 py-2.5 inline-flex items-center gap-2 disabled:opacity-60"
            >
              <Check className={`w-4 h-4 ${isSettling ? 'animate-pulse' : ''}`} />
              {isSettling ? '结算中...' : '确认结算'}
            </button>
          </div>
        </div>
      </div>
    )}

      {activity.settled && activity.settlementAt && (
        <div className="card p-6 mb-6 bg-secondary-50 border-secondary-200 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-secondary-500" />
          <h3 className="font-semibold text-gray-800 mb-2">活动已完成结算</h3>
          <p className="text-gray-500">
            结算时间：{formatDateTime(activity.settlementAt)}
          </p>
          <Link
            to={`/activity/${activity.id}`}
            className="btn-primary mt-4 inline-flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            查看公示
          </Link>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-semibold text-gray-800">成交明细</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              已付款 {report.items.filter(i => i.orderStatus !== 'pending_pay').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent-500" />
              待付款 {report.items.filter(i => i.orderStatus === 'pending_pay').length}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">拍品</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">捐赠者</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">买家</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">类型</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">成交价</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">运营成本</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">捐赠金额</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">付款状态</th>
              </tr>
            </thead>
            <tbody>
              {report.items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    暂无成交物品
                  </td>
                </tr>
              ) : (
                report.items.map(item => {
                  const statusColor = getOrderStatusColor(item.orderStatus);
                  return (
                    <tr key={item.itemId} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.itemImage}
                            alt={item.itemName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-800 text-sm">{item.itemName}</div>
                            <div className="text-xs text-gray-400">{item.orderId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.donorName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={item.buyerAvatar} alt={item.buyerName} className="w-6 h-6 rounded-full" />
                          <span className="text-sm text-gray-700">{item.buyerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.orderType === 'auction' ? 'bg-primary-50 text-primary-500' : 'bg-secondary-50 text-secondary-600'
                        }`}>
                          {item.orderType === 'auction' ? '竞拍' : '即时购'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-800 text-sm">
                        {formatPrice(item.finalPrice)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-accent-600">
                        {formatPrice(item.operationCost)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-secondary-600 font-semibold">
                        {formatPrice(item.donationAmount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${statusColor}`}>
                          {getOrderStatusLabel(item.orderStatus)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activity.settled && report.fundRecords.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              资金明细
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {report.fundRecords.map(record => (
              <div key={record.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-gray-800">{record.title}</div>
                  <div className="text-xs text-gray-400">{record.description}</div>
                  <div className="text-xs text-gray-400">{formatDateTime(record.createdAt)}</div>
                </div>
                <div className={`font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                  {record.type === 'income' ? '+' : '-'}{formatPrice(record.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
