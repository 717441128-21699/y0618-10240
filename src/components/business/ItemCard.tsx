import { Link } from 'react-router-dom';
import { Gavel, Tag, Eye } from 'lucide-react';
import type { Item } from '../../types';
import { formatPrice, getItemTypeLabel, formatNumber } from '../../utils';

interface ItemCardProps {
  item: Item;
  activityId?: string;
}

export default function ItemCard({ item }: ItemCardProps) {
  const typeColors: Record<string, string> = {
    physical: 'bg-secondary-100 text-secondary-600',
    experience: 'bg-accent-100 text-accent-600',
    service: 'bg-primary-100 text-primary-600',
  };

  return (
    <Link to={`/item/${item.id}`} className="card card-hover group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`badge text-xs ${typeColors[item.type]}`}>
            {getItemTypeLabel(item.type)}
          </span>
          {item.buyNowPrice && (
            <span className="badge text-xs bg-primary-500 text-white">
              可立即购买
            </span>
          )}
        </div>

        {item.status === 'sold' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-xl">已成交</span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/90 text-xs bg-black/30 px-2 py-1 rounded-full">
          <Eye className="w-3 h-3" />
          <span>{formatNumber(item.viewerCount)}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-12">
          {item.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <img 
            src={item.donorAvatar} 
            alt={item.donorName} 
            className="w-5 h-5 rounded-full"
          />
          <span className="text-xs text-gray-500">捐赠者：{item.donorName}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1 text-primary-500">
              <Gavel className="w-4 h-4" />
              <span className="text-lg font-bold">{formatPrice(item.currentPrice)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              起拍价 {formatPrice(item.startPrice)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">{item.bidCount}次出价</span>
          </div>
        </div>

        {item.buyNowPrice && (
          <div className="mt-3 pt-3 border-t border-warm-100 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4 text-secondary-500" />
              <span className="text-sm text-gray-600">一口价</span>
            </div>
            <span className="text-secondary-500 font-bold">
              {formatPrice(item.buyNowPrice)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
