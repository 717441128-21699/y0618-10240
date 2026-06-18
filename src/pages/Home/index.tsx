import { Link } from 'react-router-dom';
import { Heart, Users, Gift, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import ActivityCard from '../../components/business/ActivityCard';
import ItemCard from '../../components/business/ItemCard';
import { useActivityStore } from '../../store/useActivityStore';
import { formatPrice, formatNumber } from '../../utils';

export default function Home() {
  const { activities, items } = useActivityStore();
  
  const ongoingActivities = activities.filter(a => a.status === 'ongoing').slice(0, 4);
  const hotItems = items.filter(i => i.status === 'active').sort((a, b) => b.bidCount - a.bidCount).slice(0, 4);

  const totalDonation = activities.reduce((sum, a) => sum + a.currentAmount, 0);
  const totalParticipants = activities.reduce((sum, a) => sum + a.participantCount, 0);
  const totalActivities = activities.length;
  const totalItems = items.length;

  const stats = [
    { label: '累计筹款', value: formatPrice(totalDonation), icon: TrendingUp, color: 'text-primary-500', bg: 'bg-primary-50' },
    { label: '参与人数', value: formatNumber(totalParticipants), icon: Users, color: 'text-secondary-500', bg: 'bg-secondary-50' },
    { label: '义卖活动', value: totalActivities + '场', icon: Gift, color: 'text-accent-500', bg: 'bg-accent-50' },
    { label: '捐赠物品', value: totalItems + '件', icon: Heart, color: 'text-navy-500', bg: 'bg-navy-50' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&h=800&fit=crop"
            alt="公益背景"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-800/70 to-navy-700/50" />
        </div>

        <div className="relative container h-full flex items-center">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm">让每一份爱心都有迹可循</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in-up animation-delay-100">
              公益义卖
              <br />
              <span className="text-gradient">让爱温暖流动</span>
            </h1>
            
            <p className="text-lg text-gray-200 mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
              汇聚爱心，传递温暖。公益机构发起义卖与拍卖活动，
              您的每一次出价都是对公益事业的支持，所有善款扣除运营成本后全部捐赠。
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <Link to="/activities" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                立即参与
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/transparency" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/20 transition-all flex items-center gap-2">
                透明公示
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-warm-100 to-transparent" />
      </section>

      <section className="container -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="card p-6 text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl md:text-3xl font-bold text-gray-800 mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-gray-800 mb-2">热门义卖活动</h2>
            <p className="text-gray-500">精选优质公益活动，期待您的参与</p>
          </div>
          <Link to="/activities" className="flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium">
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ongoingActivities.map((activity, index) => (
            <div key={activity.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <ActivityCard activity={activity} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-warm-50 to-warm-100 py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-gray-800 mb-2">人气拍品</h2>
              <p className="text-gray-500">爱心捐赠，好物等你来拍</p>
            </div>
            <Link to="/activities" className="flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium">
              更多拍品
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {hotItems.map((item, index) => (
              <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-4">为什么选择我们</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            我们致力于打造透明、可信、有趣的公益义卖平台，让每一份爱心都能真正传递到需要帮助的人手中
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔍',
              title: '全程透明',
              desc: '每一笔资金流向都清晰可查，活动结束后公示完整财务报告和捐赠收据',
            },
            {
              icon: '🎯',
              title: '公益专注',
              desc: '专注公益场景，所有活动均由正规公益机构发起，善款直达公益项目',
            },
            {
              icon: '💝',
              title: '趣味参与',
              desc: '竞拍+即时购双模式，让公益参与更有趣，好物和爱心一举两得',
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="card p-8 text-center hover:shadow-hover transition-all animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-warm py-16 text-white">
        <div className="container text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">加入我们，一起传递温暖</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            无论是公益机构还是爱心人士，都可以在这里贡献自己的力量
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="px-8 py-3 bg-white text-primary-500 rounded-xl font-medium hover:bg-warm-50 transition-all">
              免费注册
            </Link>
            <Link to="/org/register" className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-all">
              机构入驻
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
