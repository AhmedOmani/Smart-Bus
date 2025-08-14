import { useQuery } from '@tanstack/react-query'
import { ApiAdminRepository } from '../../../infrastructure/repositories/ApiAdminRepository.js'
import { DashboardStats } from '../../components/admin/DashboardStats.jsx'
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { MapPin, Navigation, Wifi, WifiOff, Users, Bus, GraduationCap, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export const AdminDashboard = () => {
  const adminRepo = new ApiAdminRepository()

  const { data: dashboardStats, isLoading, error } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminRepo.getDashboardStats()
  })

  const { data: trackingStats } = useQuery({
    queryKey: ['tracking', 'buses'],
    queryFn: () => adminRepo.getBusesWithLocations(),
    staleTime: 10_000
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  const onlineBuses = trackingStats?.filter(bus => bus.online).length || 0
  const totalBuses = trackingStats?.length || 0
  const offlineBuses = totalBuses - onlineBuses

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand/10 to-purple-500/10 border border-brand/20 rounded-2xl p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          مرحباً بك في لوحة التحكم
        </h1>
        <p className="text-[#CFCFCF]">
          إدارة نظام الحافلات الذكية لمدرسة العصر الحديث الخاصة
        </p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats stats={dashboardStats} />

      {/* Tracking Card */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">تتبع الحافلات المباشر</h2>
            <p className="text-[#CFCFCF]">مراقبة مواقع الحافلات في الوقت الفعلي</p>
          </div>
          <Link
            to="/admin/tracking"
            className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark rounded-xl font-medium transition-colors"
          >
            <MapPin size={20} />
            فتح الخريطة
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Wifi size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{onlineBuses}</p>
                <p className="text-sm text-[#CFCFCF]">أونلاين</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <WifiOff size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{offlineBuses}</p>
                <p className="text-sm text-[#CFCFCF]">أوفلاين</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Navigation size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalBuses}</p>
                <p className="text-sm text-[#CFCFCF]">إجمالي الحافلات</p>
              </div>
            </div>
          </div>
        </div>

        {totalBuses === 0 && (
          <div className="text-center py-8">
            <MapPin size={48} className="mx-auto text-[#666] mb-2" />
            <p className="text-[#CFCFCF]">لا توجد حافلات مسجلة</p>
            <p className="text-sm text-[#666] mt-1">قم بإضافة حافلات لبدء التتبع</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="bg-[#141414] border border-[#262626] rounded-xl p-4 hover:border-brand/30 transition-colors text-center"
        >
          <Users size={24} className="mx-auto text-blue-400 mb-2" />
          <p className="text-white font-medium">إدارة المستخدمين</p>
        </Link>

        <Link
          to="/admin/buses"
          className="bg-[#141414] border border-[#262626] rounded-xl p-4 hover:border-brand/30 transition-colors text-center"
        >
          <Bus size={24} className="mx-auto text-purple-400 mb-2" />
          <p className="text-white font-medium">إدارة الحافلات</p>
        </Link>

        <Link
          to="/admin/students"
          className="bg-[#141414] border border-[#262626] rounded-xl p-4 hover:border-brand/30 transition-colors text-center"
        >
          <GraduationCap size={24} className="mx-auto text-green-400 mb-2" />
          <p className="text-white font-medium">إدارة الطلاب</p>
        </Link>

        <Link
          to="/admin/reports"
          className="bg-[#141414] border border-[#262626] rounded-xl p-4 hover:border-brand/30 transition-colors text-center"
        >
          <AlertCircle size={24} className="mx-auto text-yellow-400 mb-2" />
          <p className="text-white font-medium">التقارير</p>
        </Link>
      </div>
    </div>
  )
}
