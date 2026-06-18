import { Gavel } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { formatPrice, formatDateTime } from '../../utils';
import { Link } from 'react-router-dom';

export default function UserBids() {
  const { myBids } = useUserStore();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">我的竞拍</h1>

      {myBids.length === 0 ? (
        <div className="card p-12 text-center">
          <Gavel className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">暂无竞拍记录</h3>
          <p className="text-gray-400 mb-4">去逛逛看看有什么心仪的拍品吧</p>
          <Link to="/activities" className="btn-primary inline-block">
            去逛逛
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-warm-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">拍品</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">出价金额</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">出价时间</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">状态</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {myBids.map((bid, index) => (
                <tr key={bid.id} className="border-t border-warm-100">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">拍品 #{index + 1}</div>
                    <div className="text-sm text-gray-500">{bid.activityId}</div>
                  </td>
                  <td className="px-6 py-4 text-primary-500 font-bold">
                    {formatPrice(bid.amount)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {formatDateTime(bid.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge bg-secondary-100 text-secondary-600 text-xs">
                      {index === 0 ? '领先' : '被超越'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/item/${bid.itemId}`} className="text-primary-500 text-sm hover:underline">
                      查看详情
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
