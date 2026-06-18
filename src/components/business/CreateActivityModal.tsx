import { useState } from 'react';
import Modal from '../common/Modal';
import { Image, Target, Calendar, Building2, FileText } from 'lucide-react';
import { useActivityStore } from '../../store/useActivityStore';
import { useUserStore } from '../../store/useUserStore';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (activityId: string) => void;
}

export default function CreateActivityModal({ isOpen, onClose, onSuccess }: CreateActivityModalProps) {
  const { createActivity, getActivitiesByOrgId } = useActivityStore();
  const { currentUser } = useUserStore();
  const [formData, setFormData] = useState({
    title: '',
    banner: '',
    description: '',
    projectName: '',
    projectDesc: '',
    targetAmount: 50000,
    startTime: '',
    endTime: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const defaultStart = tomorrow.toISOString().slice(0, 16);
  const defaultEnd = nextWeek.toISOString().slice(0, 16);

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
    if (!formData.title.trim()) newErrors.title = '请输入活动标题';
    if (!formData.banner.trim()) newErrors.banner = '请输入活动封面图片链接';
    if (!formData.description.trim()) newErrors.description = '请输入活动描述';
    if (!formData.projectName.trim()) newErrors.projectName = '请输入公益项目名称';
    if (!formData.projectDesc.trim()) newErrors.projectDesc = '请输入公益项目描述';
    if (!formData.targetAmount || formData.targetAmount <= 0) newErrors.targetAmount = '请输入有效的筹款目标';
    if (!formData.startTime) newErrors.startTime = '请选择开始时间';
    if (!formData.endTime) newErrors.endTime = '请选择结束时间';
    if (formData.startTime && formData.endTime && new Date(formData.startTime) >= new Date(formData.endTime)) {
      newErrors.endTime = '结束时间必须晚于开始时间';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!currentUser?.orgId) return;

    const startDate = new Date(formData.startTime || defaultStart);
    const endDate = new Date(formData.endTime || defaultEnd);
    const now = new Date();

    let status: 'upcoming' | 'ongoing' = 'upcoming';
    if (startDate <= now) {
      startDate.setTime(now.getTime() + 60000);
      status = 'ongoing';
    }

    const activityId = createActivity({
      orgId: currentUser.orgId,
      orgName: currentUser.name,
      orgLogo: currentUser.avatar,
      title: formData.title,
      banner: formData.banner,
      description: formData.description,
      projectName: formData.projectName,
      projectDesc: formData.projectDesc,
      targetAmount: formData.targetAmount,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });

    if (status === 'ongoing') {
      useActivityStore.setState(state => ({
        activities: state.activities.map(a =>
          a.id === activityId ? { ...a, status } : a
        ),
      }));
    }

    onSuccess?.(activityId);
    onClose();
    setFormData({
      title: '',
      banner: '',
      description: '',
      projectName: '',
      projectDesc: '',
      targetAmount: 50000,
      startTime: '',
      endTime: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="创建义卖活动" width="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-2 text-gray-400" />
            活动标题
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="例如：暖冬行动·山区儿童冬衣义卖"
            className={`input-base ${errors.title ? 'border-red-300 focus:ring-red-200' : ''}`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Image className="w-4 h-4 inline mr-2 text-gray-400" />
            活动封面图片链接
          </label>
          <input
            type="text"
            value={formData.banner}
            onChange={e => handleChange('banner', e.target.value)}
            placeholder="输入图片URL，推荐尺寸 1200x500"
            className={`input-base ${errors.banner ? 'border-red-300 focus:ring-red-200' : ''}`}
          />
          {formData.banner && (
            <div className="mt-2 aspect-[12/5] rounded-xl overflow-hidden border border-warm-200">
              <img src={formData.banner} alt="预览" className="w-full h-full object-cover" />
            </div>
          )}
          {errors.banner && <p className="text-red-500 text-xs mt-1">{errors.banner}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2 text-gray-400" />
            活动介绍
          </label>
          <textarea
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={3}
            placeholder="详细介绍本次义卖活动的背景、目的等"
            className={`input-base resize-none ${errors.description ? 'border-red-300 focus:ring-red-200' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-2 text-gray-400" />
              关联公益项目名称
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={e => handleChange('projectName', e.target.value)}
              placeholder="例如：山区儿童温暖计划"
              className={`input-base ${errors.projectName ? 'border-red-300 focus:ring-red-200' : ''}`}
            />
            {errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-2 text-gray-400" />
              筹款目标金额（元）
            </label>
            <input
              type="number"
              min={1000}
              step={1000}
              value={formData.targetAmount}
              onChange={e => handleChange('targetAmount', Number(e.target.value))}
              className={`input-base ${errors.targetAmount ? 'border-red-300 focus:ring-red-200' : ''}`}
            />
            {errors.targetAmount && <p className="text-red-500 text-xs mt-1">{errors.targetAmount}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            公益项目描述
          </label>
          <textarea
            value={formData.projectDesc}
            onChange={e => handleChange('projectDesc', e.target.value)}
            rows={2}
            placeholder="介绍善款将用于什么具体用途"
            className={`input-base resize-none ${errors.projectDesc ? 'border-red-300 focus:ring-red-200' : ''}`}
          />
          {errors.projectDesc && <p className="text-red-500 text-xs mt-1">{errors.projectDesc}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2 text-gray-400" />
              开始时间
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              min={defaultStart}
              onChange={e => handleChange('startTime', e.target.value)}
              defaultValue={defaultStart}
              className={`input-base ${errors.startTime ? 'border-red-300 focus:ring-red-200' : ''}`}
            />
            {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2 text-gray-400" />
              结束时间
            </label>
            <input
              type="datetime-local"
              value={formData.endTime}
              min={defaultStart}
              onChange={e => handleChange('endTime', e.target.value)}
              defaultValue={defaultEnd}
              className={`input-base ${errors.endTime ? 'border-red-300 focus:ring-red-200' : ''}`}
            />
            {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
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
            创建活动
          </button>
        </div>
      </form>
    </Modal>
  );
}
