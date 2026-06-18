import { useState, useMemo } from 'react';
import Modal from '../common/Modal';
import { Package, Tag, User as UserIcon, Image, DollarSign, Clock, FileText, ShoppingCart, Gavel } from 'lucide-react';
import type { Item } from '../../types';
import { useActivityStore } from '../../store/useActivityStore';
import { useUserStore } from '../../store/useUserStore';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultActivityId?: string;
  onSuccess?: (itemId: string) => void;
}

export default function CreateItemModal({ isOpen, onClose, defaultActivityId, onSuccess }: CreateItemModalProps) {
  const { addItem, getActivitiesByOrgId } = useActivityStore();
  const { currentUser } = useUserStore();
  const orgActivities = useMemo(() => {
    if (!currentUser?.orgId) return [];
    return getActivitiesByOrgId(currentUser.orgId).filter(a => a.status !== 'ended');
  }, [currentUser, getActivitiesByOrgId]);

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    type: 'physical' as Item['type'],
    category: '',
    donorName: '',
    donorAvatar: '',
    startPrice: 100,
    buyNowPrice: '',
    minIncrement: 10,
    activityId: defaultActivityId || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.activityId) newErrors.activityId = '请选择归属活动';
    if (!formData.name.trim()) newErrors.name = '请输入物品名称';
    if (!formData.image.trim()) newErrors.image = '请输入物品图片链接';
    if (!formData.description.trim()) newErrors.description = '请输入物品描述';
    if (!formData.category.trim()) newErrors.category = '请输入物品分类';
    if (!formData.donorName.trim()) newErrors.donorName = '请输入捐赠者姓名';
    if (!formData.startPrice || formData.startPrice <= 0) newErrors.startPrice = '请输入有效的起拍价';
    if (formData.buyNowPrice && Number(formData.buyNowPrice) < formData.startPrice) {
      newErrors.buyNowPrice = '一口价不能低于起拍价';
    }
    if (!formData.minIncrement || formData.minIncrement <= 0) newErrors.minIncrement = '请输入有效的最小加价';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...formData,
      activityId: formData.activityId,
      buyNowPrice: formData.buyNowPrice ? Number(formData.buyNowPrice) : undefined,
    };

    const itemId = addItem(data);
    onSuccess?.(itemId);
    onClose();
    setFormData({
      name: '',
      image: '',
      description: '',
      type: 'physical',
      category: '',
      donorName: '',
      donorAvatar: '',
      startPrice: 100,
      buyNowPrice: '',
      minIncrement: 10,
      activityId: defaultActivityId || '',
    });
  };

  const typeOptions = [
    { value: 'physical', label: '实物物品', icon: Package, desc: '需要邮寄的物品' },
    { value: 'experience', label: '体验权益', icon: Clock, desc: '如演出门票、课程体验等' },
    { value: 'service', label: '专业服务', icon: Gavel, desc: '如咨询、设计、翻译等服务' },
  ] as const;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="上架捐赠物品" width="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-2 text-gray-400" />
            归属活动
          </label>
          <select
            value={formData.activityId}
            onChange={e => handleChange('activityId', e.target.value)}
            className={`input-base ${errors.activityId ? 'border-red-300 focus:ring-red-200' : ''}`}
          >
            <option value="">请选择活动</option>
            {orgActivities.map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
          {errors.activityId && <p className="text-red-500 text-xs mt-1">{errors.activityId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4 inline mr-2 text-gray-400" />
            物品名称
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="例如：限量签名版图书《人类简史》"
            className={`input-base ${errors.name ? 'border-red-300 focus:ring-red-200' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Image className="w-4 h-4 inline mr-2 text-gray-400" />
            物品图片链接
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={e => handleChange('image', e.target.value)}
            placeholder="输入图片URL"
            className={`input-base ${errors.image ? 'border-red-300 focus:ring-red-200' : ''}`}
          />
          {formData.image && (
            <div className="mt-2 w-32 h-32 rounded-xl overflow-hidden border border-warm-200">
              <img src={formData.image} alt="预览" className="w-full h-full object-cover" />
            </div>
          )}
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            物品类型
          </label>
          <div className="grid grid-cols-3 gap-3">
            {typeOptions.map(opt => {
              const Icon = opt.icon;
              const active = formData.type === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('type', opt.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    active
                      ? 'border-primary bg-primary/5'
                      : 'border-warm-200 hover:border-warm-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${active ? 'text-primary' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${active ? 'text-primary' : 'text-gray-700'}`}>{opt.label}</div>
                  <div className="text-xs text-gray-400">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2 text-gray-400" />
            物品描述
          </label>
          <textarea
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={3}
            placeholder="详细描述物品的品质、数量、使用方法等"
            className={`input-base resize-none ${errors.description ? 'border-red-300 focus:ring-red-200' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              物品分类
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={e => handleChange('category', e.target.value)}
              placeholder="例如：图书、服饰、数码、手工艺品"
              className={`input-base ${errors.category ? 'border-red-300 focus:ring-red-200' : ''}`}
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-4 h-4 inline mr-2 text-gray-400" />
              捐赠者姓名
            </label>
            <input
              type="text"
              value={formData.donorName}
              onChange={e => handleChange('donorName', e.target.value)}
              placeholder="例如：张三"
              className={`input-base ${errors.donorName ? 'border-red-300 focus:ring-red-200' : ''}`}
            />
            {errors.donorName && <p className="text-red-500 text-xs mt-1">{errors.donorName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2 text-gray-400" />
              起拍价（元）
            </label>
            <input
              type="number"
              min={1}
              value={formData.startPrice}
              onChange={e => handleChange('startPrice', Number(e.target.value))}
              className={`input-base ${errors.startPrice ? 'border-red-300 focus:ring-red-200' : ''}`}
            />
            {errors.startPrice && <p className="text-red-500 text-xs mt-1">{errors.startPrice}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ShoppingCart className="w-4 h-4 inline mr-2 text-gray-400" />
              一口价（元）
            </label>
            <input
              type="number"
              min={1}
              value={formData.buyNowPrice}
              onChange={e => handleChange('buyNowPrice', e.target.value)}
              placeholder="留空则不支持一口价"
              className={`input-base ${errors.buyNowPrice ? 'border-red-300 focus:ring-red-200' : ''}`}
            />
            {errors.buyNowPrice && <p className="text-red-500 text-xs mt-1">{errors.buyNowPrice}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Gavel className="w-4 h-4 inline mr-2 text-gray-400" />
              最小加价（元）
            </label>
            <input
              type="number"
              min={1}
              value={formData.minIncrement}
              onChange={e => handleChange('minIncrement', Number(e.target.value))}
              className={`input-base ${errors.minIncrement ? 'border-red-300 focus:ring-red-200' : ''}`}
            />
            {errors.minIncrement && <p className="text-red-500 text-xs mt-1">{errors.minIncrement}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-warm-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-warm-50"
          >
            取消
          </button>
          <button type="submit" className="btn-primary px-8 py-2.5">
            上架物品
          </button>
        </div>
      </form>
    </Modal>
  );
}
