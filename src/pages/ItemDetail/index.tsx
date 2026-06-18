import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Gavel, Tag, Truck, Shield, Clock, Heart, 
  Share2, ChevronLeft, ChevronRight, Minus, Plus,
  AlertCircle, Check, Package, User
} from 'lucide-react';
import BidRecordList from '../../components/business/BidRecordList';
import CountdownTimer from '../../components/common/CountdownTimer';
import { useActivityStore } from '../../store/useActivityStore';
import { useUserStore } from '../../store/useUserStore';
import { formatPrice, getItemTypeLabel, generateId } from '../../utils';
import type { Order } from '../../types';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById, getBidsByItemId, getActivityById, placeBid, buyNow } = useActivityStore();
  const { isLoggedIn, currentUser, addBid, addOrder } = useUserStore();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [isFollowed, setIsFollowed] = useState(false);
  const [showBidSuccess, setShowBidSuccess] = useState(false);
  const [showBuyNowConfirm, setShowBuyNowConfirm] = useState(false);

  const item = getItemById(id || '');
  const bids = getBidsByItemId(id || '');
  const activity = item ? getActivityById(item.activityId) : undefined;

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-xl font-medium text-gray-600 mb-2">物品不存在</h2>
          <Link to="/activities" className="text-primary-500 hover:underline">
            返回活动列表
          </Link>
        </div>
      </div>
    );
  }

  const minBid = item.currentPrice + item.minIncrement;

  const handleQuickBid = (increment: number) => {
    const newAmount = Math.max(minBid, item.currentPrice + increment);
    setBidAmount(newAmount);
  };

  const handleBidSubmit = () => {
    if (!isLoggedIn || !currentUser) {
      navigate('/login?redirect=' + encodeURIComponent(`/item/${id}`));
      return;
    }

    if (bidAmount < minBid) {
      alert(`出价不能低于 ${formatPrice(minBid)}`);
      return;
    }

    const success = placeBid(item.id, currentUser.id, currentUser.name, currentUser.avatar, bidAmount);
    if (success) {
      const newBid = {
        id: 'bid-' + generateId(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        itemId: item.id,
        activityId: item.activityId,
        amount: bidAmount,
        createdAt: new Date().toISOString(),
      };
      addBid(newBid);
      setShowBidSuccess(true);
      setTimeout(() => setShowBidSuccess(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn || !currentUser) {
      navigate('/login?redirect=' + encodeURIComponent(`/item/${id}`));
      return;
    }
    setShowBuyNowConfirm(true);
  };

  const confirmBuyNow = () => {
    if (!currentUser || !item.buyNowPrice) return;
    
    const result = buyNow(item.id, currentUser.id, currentUser.name);
    if (result.success && result.orderId) {
      const order: Order = {
        id: result.orderId,
        userId: currentUser.id,
        itemId: item.id,
        activityId: item.activityId,
        itemName: item.name,
        itemImage: item.image,
        itemType: item.type,
        amount: item.buyNowPrice,
        type: 'buynow',
        status: 'pending_pay',
        donorName: item.donorName,
        createdAt: new Date().toISOString(),
      };
      addOrder(order);
      setShowBuyNowConfirm(false);
      navigate(`/user/orders`);
    }
  };

  const typeColors: Record<string, string> = {
    physical: 'bg-secondary-100 text-secondary-600',
    experience: 'bg-accent-100 text-accent-600',
    service: 'bg-primary-100 text-primary-600',
  };

  return (
    <div className="min-h-screen bg-warm-50 pb-16">
      {activity && (
        <div className="bg-white border-b border-warm-100">
          <div className="container py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-primary-500">首页</Link>
              <span>/</span>
              <Link to="/activities" className="hover:text-primary-500">义卖活动</Link>
              <span>/</span>
              <Link to={`/activity/${activity.id}`} className="hover:text-primary-500">{activity.title}</Link>
              <span>/</span>
              <span className="text-gray-800">{item.name}</span>
            </div>
          </div>
        </div>
      )}

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="card overflow-hidden mb-4">
              <div className="relative aspect-square">
                <img
                  src={item.images[currentImageIndex] || item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`badge ${typeColors[item.type]}`}>
                    {getItemTypeLabel(item.type)}
                  </span>
                  {item.status === 'sold' && (
                    <span className="badge bg-gray-600 text-white">已成交</span>
                  )}
                </div>
              </div>
            </div>
            
            {item.images.length > 1 && (
              <div className="flex gap-3">
                {item.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-primary-500'
                        : 'border-transparent hover:border-primary-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="card p-6 mb-6">
              <h1 className="font-serif text-2xl font-bold text-gray-800 mb-4">
                {item.name}
              </h1>

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-warm-100">
                <img 
                  src={item.donorAvatar} 
                  alt={item.donorName} 
                  className="w-12 h-12 rounded-full bg-warm-100"
                />
                <div>
                  <div className="text-sm text-gray-500">捐赠者</div>
                  <div className="font-medium text-gray-800">{item.donorName}</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-baseline gap-2">
                  <Gavel className="w-5 h-5 text-primary-500" />
                  <span className="text-sm text-gray-500">当前价</span>
                  <span className="text-3xl font-bold text-primary-500">{formatPrice(item.currentPrice)}</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>起拍价 {formatPrice(item.startPrice)}</span>
                  </div>
                  <div>{item.bidCount}次出价</div>
                  <div>{item.viewerCount}人关注</div>
                </div>
              </div>

              {item.status === 'active' && (
                <>
                  <div className="bg-warm-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">距离结束</span>
                      {activity && <CountdownTimer endTime={activity.endTime} size="sm" />}
                    </div>
                    <div className="text-xs text-gray-400">
                      加价幅度：{formatPrice(item.minIncrement)}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-gray-600 mb-2">
                      我要出价
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1 flex items-center border border-warm-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleQuickBid(-item.minIncrement)}
                          className="px-4 py-3 hover:bg-warm-50 transition-colors"
                        >
                          <Minus className="w-5 h-5 text-gray-400" />
                        </button>
                        <div className="flex-1 text-center">
                          <span className="text-2xl font-bold text-primary-500">
                            {formatPrice(bidAmount || minBid)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleQuickBid(item.minIncrement)}
                          className="px-4 py-3 hover:bg-warm-50 transition-colors"
                        >
                          <Plus className="w-5 h-5 text-primary-500" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[1, 2, 5, 10].map(multiple => (
                        <button
                          key={multiple}
                          onClick={() => handleQuickBid(item.minIncrement * multiple)}
                          className="flex-1 py-2 text-sm bg-warm-100 text-gray-600 rounded-lg hover:bg-warm-200 transition-colors"
                        >
                          +{formatPrice(item.minIncrement * multiple)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBidSubmit}
                      disabled={item.status !== 'active'}
                      className="flex-1 btn-primary text-lg flex items-center justify-center gap-2 relative"
                    >
                      <Gavel className="w-5 h-5" />
                      确认出价
                      {showBidSuccess && (
                        <div className="absolute inset-0 bg-green-500 rounded-xl flex items-center justify-center text-white animate-fade-in-up">
                          <Check className="w-5 h-5 mr-2" />
                          出价成功！
                        </div>
                      )}
                    </button>
                  </div>

                  {item.buyNowPrice && (
                    <>
                      <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-warm-200" />
                        <span className="text-sm text-gray-400">或</span>
                        <div className="flex-1 h-px bg-warm-200" />
                      </div>
                      <button
                        onClick={handleBuyNow}
                        disabled={item.status !== 'active'}
                        className="w-full py-4 bg-secondary-500 text-white rounded-xl font-medium text-lg hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Tag className="w-5 h-5" />
                        立即购买 {formatPrice(item.buyNowPrice)}
                      </button>
                    </>
                  )}
                </>
              )}

              {item.status === 'sold' && (
                <div className="bg-gray-100 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="text-lg font-medium text-gray-700 mb-1">已成交</div>
                  <div className="text-sm text-gray-500">成交价 {formatPrice(item.currentPrice)}</div>
                </div>
              )}

              <div className="flex gap-3 mt-6 pt-6 border-t border-warm-100">
                <button
                  onClick={() => setIsFollowed(!isFollowed)}
                  className="flex-1 py-2 border border-warm-200 rounded-xl text-sm text-gray-600 hover:bg-warm-50 transition-colors flex items-center justify-center gap-1"
                >
                  <Heart className={`w-4 h-4 ${isFollowed ? 'fill-primary-500 text-primary-500' : ''}`} />
                  {isFollowed ? '已关注' : '关注'}
                </button>
                <button className="flex-1 py-2 border border-warm-200 rounded-xl text-sm text-gray-600 hover:bg-warm-50 transition-colors flex items-center justify-center gap-1">
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-secondary-500" />
                保障说明
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>所有善款扣除10%运营成本后全部捐赠给指定公益项目</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>捐赠物品由捐赠方负责寄送或兑现服务</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>活动结束后公示完整资金去向和捐赠收据</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-6 mb-6">
              <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">
                物品详情
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p className="whitespace-pre-wrap leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">
                配送与服务
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 mb-1">配送说明</div>
                    <div className="text-sm text-gray-600">{item.deliveryDesc}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-secondary-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 mb-1">物品类型</div>
                    <div className="text-sm text-gray-600">
                      {getItemTypeLabel(item.type)}
                      {item.type === 'physical' && ' - 实物物品，邮寄送达'}
                      {item.type === 'experience' && ' - 体验类，凭券兑换'}
                      {item.type === 'service' && ' - 服务类，预约体验'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-primary-500" />
                出价记录
                <span className="text-sm font-normal text-gray-400">({bids.length})</span>
              </h3>
              <BidRecordList bids={bids} maxShow={5} />
            </div>

            {activity && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
                  所属活动
                </h3>
                <Link to={`/activity/${activity.id}`} className="block">
                  <img
                    src={activity.banner}
                    alt={activity.title}
                    className="w-full h-32 object-cover rounded-xl mb-3"
                  />
                  <h4 className="font-medium text-gray-800 mb-1 line-clamp-1">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-500">{activity.orgName}</p>
                </Link>
              </div>
            )}

            <div className="card p-6 bg-gradient-to-br from-primary-500 to-accent-500 text-white">
              <h3 className="font-semibold mb-2">温馨提示</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                出价前请仔细阅读物品描述，出价即表示您同意平台规则。
                竞拍成功后请在24小时内付款，否则订单将自动取消。
                如有疑问请联系客服。
              </p>
            </div>
          </div>
        </div>
      </div>

      {showBuyNowConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-fade-in-up">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">确认购买</h3>
            <p className="text-gray-500 mb-4">确定以 {formatPrice(item.buyNowPrice || 0)} 的价格购买此物品吗？</p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowBuyNowConfirm(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={confirmBuyNow}
                className="flex-1 btn-primary"
              >
                确认购买
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
