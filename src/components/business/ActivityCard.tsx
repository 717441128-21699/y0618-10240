import { Link } from 'react-router-dom';
import { Users, Clock } from 'lucide-react';
import type { Activity } from '../../types';
import { formatPrice, formatNumber, getActivityStatusLabel, getActivityStatusColor } from '../../utils';
import { useCountdown } from '../../hooks/useCountdown';

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const progress = Math.min(100, (activity.currentAmount / activity.targetAmount) * 100);
  const { days, hours, isEnded } = useCountdown(activity.endTime);

  return (
    <Link to={`/activity/${activity.id}`} className="card card-hover group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={activity.banner}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3">
          <span className={`badge ${getActivityStatusColor(activity.status)}`}>
            {getActivityStatusLabel(activity.status)}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-serif text-lg font-semibold mb-1 line-clamp-1">
            {activity.title}
          </h3>
          <div className="flex items-center gap-1 text-sm opacity-90">
            <img src={activity.orgLogo} alt={activity.orgName} className="w-5 h-5 rounded-full" />
            <span>{activity.orgName}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">已筹 {formatPrice(activity.currentAmount)}</span>
            <span className="text-primary-500 font-medium">{progress.toFixed(0)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{formatNumber(activity.participantCount)}人参与</span>
          </div>
          {activity.status === 'ongoing' && !isEnded && (
            <div className="flex items-center gap-1 text-primary-500">
              <Clock className="w-4 h-4" />
              <span>剩 {days}天{hours}时</span>
            </div>
          )}
          {activity.status === 'upcoming' && (
            <span className="text-navy-500">即将开始</span>
          )}
          {activity.status === 'ended' && (
            <span className="text-gray-400">已结束</span>
          )}
        </div>
      </div>
    </Link>
  );
}
