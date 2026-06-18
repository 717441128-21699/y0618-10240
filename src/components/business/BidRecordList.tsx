import type { Bid } from '../../types';
import { formatPrice, formatRelativeTime } from '../../utils';

interface BidRecordListProps {
  bids: Bid[];
  maxShow?: number;
}

export default function BidRecordList({ bids, maxShow = 10 }: BidRecordListProps) {
  const displayBids = bids.slice(0, maxShow);

  if (displayBids.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>暂无出价记录</p>
        <p className="text-sm mt-1">快来第一个出价吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayBids.map((bid, index) => (
        <div
          key={bid.id}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
            index === 0 ? 'bg-primary-50 border border-primary-100' : 'bg-warm-50'
          }`}
        >
          <img
            src={bid.userAvatar}
            alt={bid.userName}
            className="w-10 h-10 rounded-full bg-warm-200"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800 truncate">
                {index === 0 && (
                  <span className="inline-block w-5 h-5 text-xs bg-primary-500 text-white rounded-full text-center mr-2 leading-5">
                    1
                  </span>
                )}
                {bid.userName}
              </span>
              <span className="text-primary-500 font-bold">
                {formatPrice(bid.amount)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {formatRelativeTime(bid.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
