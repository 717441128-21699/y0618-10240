import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-600 text-white mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="font-serif text-xl font-bold">爱心义卖</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              专注公益场景的义卖与拍卖平台，让每一份爱心都有迹可循，让每一份善意都温暖人心。
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-primary-300 transition-colors">首页</Link></li>
              <li><Link to="/activities" className="hover:text-primary-300 transition-colors">义卖活动</Link></li>
              <li><Link to="/transparency" className="hover:text-primary-300 transition-colors">透明公示</Link></li>
              <li><Link to="/about" className="hover:text-primary-300 transition-colors">关于我们</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">公益机构</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/org/register" className="hover:text-primary-300 transition-colors">机构入驻</Link></li>
              <li><Link to="/org/guide" className="hover:text-primary-300 transition-colors">入驻指南</Link></li>
              <li><Link to="/org/faq" className="hover:text-primary-300 transition-colors">常见问题</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">联系我们</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@charity-auction.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>400-888-8888</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>北京市朝阳区公益大厦8层</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-500 mt-10 pt-6 text-center text-sm text-gray-400">
          <p>© 2024 爱心义卖平台 版权所有 | 京ICP备xxxxxxxx号</p>
        </div>
      </div>
    </footer>
  );
}
