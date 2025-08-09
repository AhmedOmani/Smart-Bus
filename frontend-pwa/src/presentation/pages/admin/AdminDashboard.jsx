import { DashboardStats } from '../../components/admin/DashboardStats.jsx'
import { Activity, Zap } from 'lucide-react'

// Presentation Page - Admin Dashboard
export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
        <p className="text-[#CFCFCF]">مرحباً بك في نظام إدارة المدرسة</p>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity size={20} className="text-blue-400" />
            </div>
            الأنشطة الأخيرة
          </h2>
          <p className="text-[#CFCFCF] text-sm">قريباً... سيتم عرض آخر الأنشطة هنا</p>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
            <div className="p-2 bg-brand/20 rounded-lg">
              <Zap size={20} className="text-brand" />
            </div>
            إجراءات سريعة
          </h2>
          <p className="text-[#CFCFCF] text-sm">قريباً... إجراءات سريعة ومفيدة</p>
        </div>
      </div>
    </div>
  )
}
