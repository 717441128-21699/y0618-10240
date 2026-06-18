import { useState } from 'react';
import Modal from '../common/Modal';
import { FileText, Plus, Edit2, Trash2, Upload, Image as ImageIcon, X, Check } from 'lucide-react';
import { useActivityStore } from '../../store/useActivityStore';
import type { DonationReceipt } from '../../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: string;
  activityTitle: string;
  orgName: string;
  projectName: string;
}

interface EditableReceipt extends Partial<Omit<DonationReceipt, 'id' | 'activityId' | 'activityTitle' | 'orgName' | 'donateTime'>> {}

export default function ReceiptModal({ isOpen, onClose, activityId, activityTitle, orgName, projectName }: ReceiptModalProps) {
  const { receipts, addReceipt, updateReceipt, deleteReceipt, getReceiptsByActivityId } = useActivityStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditableReceipt>({
    title: '',
    imageUrl: '',
    amount: 0,
    project: projectName,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activityReceipts = getReceiptsByActivityId(activityId);

  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      amount: 0,
      project: projectName,
      description: '',
    });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (receipt: DonationReceipt) => {
    setEditingId(receipt.id);
    setFormData({
      title: receipt.title,
      imageUrl: receipt.imageUrl,
      amount: receipt.amount,
      project: receipt.project,
      description: receipt.description,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除这张捐赠收据吗？')) {
      deleteReceipt(id);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = '请输入收据标题';
    if (!formData.imageUrl?.trim()) newErrors.imageUrl = '请输入收据图片链接';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = '请输入有效的捐赠金额';
    if (!formData.project?.trim()) newErrors.project = '请输入公益项目名称';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingId) {
      updateReceipt(editingId, {
        title: formData.title,
        imageUrl: formData.imageUrl,
        amount: formData.amount,
        project: formData.project,
        description: formData.description,
      });
    } else {
      addReceipt({
        activityId,
        activityTitle,
        orgName,
        title: formData.title!,
        imageUrl: formData.imageUrl!,
        amount: formData.amount!,
        project: formData.project!,
        description: formData.description!,
      });
    }
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="捐赠收据管理" width="max-w-4xl">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-1">{activityTitle}</h3>
            <p className="text-sm text-gray-500">管理活动的捐赠收据，结算后将在活动详情页公示</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2 text-sm px-5 py-2"
            >
              <Plus className="w-4 h-4" />
              添加收据
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-6 p-5 bg-warm-50 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">
              {editingId ? '编辑收据' : '添加收据'}
            </h4>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2 text-gray-400" />
                收据标题
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="例如：山区儿童温暖计划捐赠收据"
                className={`input-base text-sm ${errors.title ? 'border-red-300 focus:ring-red-200' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2 text-gray-400" />
                收据图片链接
              </label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="输入捐赠收据扫描件图片URL"
                className={`input-base text-sm ${errors.imageUrl ? 'border-red-300 focus:ring-red-200' : ''}`}
              />
              {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
              {formData.imageUrl && (
                <div className="mt-2 w-32 h-40 rounded-xl overflow-hidden border border-warm-200 bg-white">
                  <img src={formData.imageUrl} alt="收据预览" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                捐赠金额（元）
              </label>
              <input
                type="number"
                min={1}
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                className={`input-base text-sm ${errors.amount ? 'border-red-300 focus:ring-red-200' : ''}`}
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                捐赠项目
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={e => setFormData({ ...formData, project: e.target.value })}
                placeholder="例如：山区儿童温暖计划"
                className={`input-base text-sm ${errors.project ? 'border-red-300 focus:ring-red-200' : ''}`}
              />
              {errors.project && <p className="text-red-500 text-xs mt-1">{errors.project}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                说明
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="说明捐赠用途、受捐方等信息"
                className="input-base text-sm resize-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-warm-50 text-sm"
              >
                取消
              </button>
              <button type="submit" className="btn-primary px-8 py-2 text-sm">
                {editingId ? '保存修改' : '保存'}
              </button>
            </div>
          </form>
        </div>
      )}

        {activityReceipts.length === 0 && !showForm ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-4">暂无捐赠收据</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加第一张收据
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activityReceipts.map(receipt => (
              <div
                key={receipt.id}
                className="flex gap-4 p-4 bg-white border border-warm-200 rounded-xl hover:border-primary-300 transition-colors">
                <img
                  src={receipt.imageUrl}
                  alt={receipt.title}
                  className="w-24 h-32 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{receipt.title}</h4>
                    <div className="text-xl font-bold text-primary-500">
                      ¥{receipt.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    捐赠项目：{receipt.project}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    捐赠机构：{receipt.orgName}
                  </div>
                  {receipt.description && (
                    <div className="text-sm text-gray-600">{receipt.description}</div>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(receipt)}
                    className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(receipt.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
