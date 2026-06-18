export function formatPrice(price: number): string {
  return '¥' + price.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString('zh-CN');
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date().getTime();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return formatDate(dateStr);
}

export function getCountdown(endTimeStr: string): { days: number; hours: number; minutes: number; seconds: number; total: number } {
  const now = new Date().getTime();
  const end = new Date(endTimeStr).getTime();
  const diff = Math.max(0, end - now);
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, total: diff };
}

export function getItemTypeLabel(type: string): string {
  const map: Record<string, string> = {
    physical: '实物',
    experience: '体验',
    service: '服务',
  };
  return map[type] || type;
}

export function getOrderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending_pay: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成',
    cancelled: '已取消',
  };
  return map[status] || status;
}

export function getActivityStatusLabel(status: string): string {
  const map: Record<string, string> = {
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束',
  };
  return map[status] || status;
}

export function getActivityStatusColor(status: string): string {
  const map: Record<string, string> = {
    upcoming: 'bg-navy-100 text-navy-600',
    ongoing: 'bg-secondary-100 text-secondary-600',
    ended: 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-500';
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending_pay: 'bg-accent-100 text-accent-600',
    paid: 'bg-navy-100 text-navy-600',
    shipped: 'bg-secondary-100 text-secondary-600',
    completed: 'bg-green-100 text-green-600',
    cancelled: 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-500';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
