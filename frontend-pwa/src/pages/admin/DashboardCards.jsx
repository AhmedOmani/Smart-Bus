import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'

function StatCard({ title, value, delta, icon }) {
  return (
    <div className="rounded-2xl p-4 bg-[#141414] border border-[#262626]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-[#CFCFCF]">{title}</div>
        <div className="grid place-items-center h-9 w-9 rounded-lg bg-[#0B0B0B] border border-[#262626]">{icon}</div>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {delta != null && (
        <div className="text-xs mt-1 text-[#CFCFCF]">{delta}</div>
      )}
    </div>
  )
}

export default function DashboardCards() {
  const { data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard')
      return res.data.data
    },
  })

  const stats = data || { totalUsers: 0, totalStudents: 0, activeBuses: 0 }

  return (
    <motion.div 
      className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <StatCard title="الطلاب النشطون" value={stats.totalStudents} icon={<span>🎓</span>} index={0} />
      <StatCard title="الحافلات النشطة" value={stats.activeBuses} icon={<span>🚌</span>} index={1} />
      <StatCard title="إجمالي المستخدمين" value={stats.totalUsers} icon={<span>👥</span>} index={2} />
      <StatCard title="التقارير المعلقة" value={'—'} icon={<span>⚠️</span>} index={3} />
    </motion.div>
  )
}
