import { useAdminDashboard } from '../../hooks/useAdminDashboard.js'
import { LoadingSpinner } from '../common/LoadingSpinner.jsx'
import { ErrorMessage } from '../common/ErrorMessage.jsx'
import { Users, GraduationCap, Bus, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'

// Presentation Component - Dashboard Stats
export const DashboardStats = () => {
  const { data: stats, isLoading, isError, error, refetch } = useAdminDashboard()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <ErrorMessage
        title="فشل في تحميل الإحصائيات"
        message={error?.message || 'حدث خطأ أثناء تحميل بيانات لوحة التحكم'}
        onRetry={refetch}
      />
    )
  }

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats?.totalUsers || 0,
      icon: Users,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      growth: stats?.userGrowth
    },
    {
      title: 'الطلاب النشطون',
      value: stats?.totalStudents || 0,
      icon: GraduationCap,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/20',
      growth: stats?.studentGrowth
    },
    {
      title: 'الحافلات النشطة',
      value: stats?.activeBuses || 0,
      icon: Bus,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/20'
    },
    {
      title: 'التقارير المعلقة',
      value: '—',
      icon: AlertCircle,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20'
    }
  ]

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}

const StatCard = ({ title, value, icon: IconComponent, iconColor, iconBg, growth }) => {
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 hover:border-[#3a3a3a] transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-[#CFCFCF] font-medium">
          {title}
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          <IconComponent size={24} className={iconColor} />
        </div>
      </div>
      
      <div className="text-3xl font-bold text-white mb-2">
        {value}
      </div>
      
      {growth !== undefined && growth !== null && (
        <div className={`text-xs flex items-center gap-1 ${
          growth > 0 ? 'text-green-400' : growth < 0 ? 'text-red-400' : 'text-[#CFCFCF]'
        }`}>
          {growth > 0 && <TrendingUp size={12} />}
          {growth < 0 && <TrendingDown size={12} />}
          {growth === 0 && <Minus size={12} />}
          <span>{Math.abs(growth).toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}
