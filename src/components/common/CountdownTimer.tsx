import { Clock } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  endTime: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CountdownTimer({ endTime, showLabels = true, size = 'md' }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isEnded } = useCountdown(endTime);

  if (isEnded) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Clock className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />
        <span className={size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}>
          已结束
        </span>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg',
  };

  const isUrgent = days === 0 && hours < 10;

  return (
    <div className="flex items-center gap-2">
      <Clock className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} ${isUrgent ? 'text-red-500 animate-pulse' : 'text-primary-500'}`} />
      <div className="flex items-center gap-1">
        {days > 0 && (
          <>
            <div className={`${sizeClasses[size]} bg-navy-500 text-white rounded-lg flex items-center justify-center font-bold`}>
              {String(days).padStart(2, '0')}
            </div>
            {showLabels && <span className="text-xs text-gray-500">天</span>}
          </>
        )}
        <div className={`${sizeClasses[size]} bg-navy-500 text-white rounded-lg flex items-center justify-center font-bold`}>
          {String(hours).padStart(2, '0')}
        </div>
        {showLabels && <span className="text-xs text-gray-500">时</span>}
        <div className={`${sizeClasses[size]} bg-navy-500 text-white rounded-lg flex items-center justify-center font-bold`}>
          {String(minutes).padStart(2, '0')}
        </div>
        {showLabels && <span className="text-xs text-gray-500">分</span>}
        {size !== 'sm' && (
          <>
            <div className={`${sizeClasses[size]} ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-navy-500'} text-white rounded-lg flex items-center justify-center font-bold`}>
              {String(seconds).padStart(2, '0')}
            </div>
            {showLabels && <span className="text-xs text-gray-500">秒</span>}
          </>
        )}
      </div>
    </div>
  );
}
