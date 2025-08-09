import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ApiAdminRepository } from '../../../infrastructure/repositories/ApiAdminRepository.js'
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { FileBarChart, Calendar, Filter } from 'lucide-react'

// Presentation Page - Reports Management
export const ReportsManagement = () => {
  const adminRepo = new ApiAdminRepository()
  
  const [activeTab, setActiveTab] = useState('absences')
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    studentId: '',
    busId: '',
    startDate: '',
    endDate: ''
  })

  // Fetch students and buses for filters
  const { data: students = [] } = useQuery({
    queryKey: ['admin', 'students'],
    queryFn: () => adminRepo.getStudents()
  })

  const { data: buses = [] } = useQuery({
    queryKey: ['admin', 'buses'],
    queryFn: () => adminRepo.getBuses()
  })

  // Fetch absences
  const { data: absences = [], isLoading: isLoadingAbsences, error: absencesError } = useQuery({
    queryKey: ['admin', 'absences', filters],
    queryFn: () => adminRepo.getAbsences(filters),
    enabled: activeTab === 'absences'
  })

  // Fetch permissions
  const { data: permissions = [], isLoading: isLoadingPermissions, error: permissionsError } = useQuery({
    queryKey: ['admin', 'permissions', filters],
    queryFn: () => adminRepo.getPermissions(filters),
    enabled: activeTab === 'permissions'
  })

  const resetFilters = () => {
    setFilters({
      status: '',
      type: '',
      studentId: '',
      busId: '',
      startDate: '',
      endDate: ''
    })
  }

  const hasFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">التقارير والإحصائيات</h1>
        <p className="text-[#CFCFCF] mt-1">مراقبة غياب الطلاب والأذونات المقدمة</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#141414] border border-[#262626] rounded-2xl p-2">
        <button
          onClick={() => setActiveTab('absences')}
          className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'absences'
              ? 'bg-brand text-white'
              : 'text-[#CFCFCF] hover:text-white hover:bg-[#0B0B0B]'
          }`}
        >
          <FileBarChart size={18} />
          تقارير الغياب
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'permissions'
              ? 'bg-brand text-white'
              : 'text-[#CFCFCF] hover:text-white hover:bg-[#0B0B0B]'
          }`}
        >
          <Calendar size={18} />
          تقارير الأذونات
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Filter size={20} />
            تصفية البيانات
          </h2>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-brand hover:text-brand-dark border border-brand/20 rounded-lg hover:bg-brand/10 transition-colors"
            >
              مسح الفلاتر
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الحالة</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="PENDING">قيد المراجعة</option>
              <option value="APPROVED">مُوافق عليه</option>
              <option value="REJECTED">مرفوض</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">النوع</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm"
            >
              <option value="">جميع الأنواع</option>
              {activeTab === 'absences' ? (
                <>
                  <option value="SICK">مرض</option>
                  <option value="PERSONAL">شخصي</option>
                  <option value="SCHOOL_EVENT">نشاط مدرسي</option>
                  <option value="OTHER">أخرى</option>
                </>
              ) : (
                <>
                  <option value="ARRIVAL">إحضار</option>
                  <option value="EXIT">استلام</option>
                </>
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الطالب</label>
            <select
              value={filters.studentId}
              onChange={(e) => setFilters(prev => ({ ...prev, studentId: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm"
            >
              <option value="">جميع الطلاب</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الحافلة</label>
            <select
              value={filters.busId}
              onChange={(e) => setFilters(prev => ({ ...prev, busId: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm"
            >
              <option value="">جميع الحافلات</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.busNumber}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">من تاريخ</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">إلى تاريخ</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'absences' ? (
        <AbsencesTable 
          absences={absences} 
          loading={isLoadingAbsences} 
          error={absencesError} 
        />
      ) : (
        <PermissionsTable 
          permissions={permissions} 
          loading={isLoadingPermissions} 
          error={permissionsError} 
        />
      )}
    </div>
  )
}

// Absences Table Component
const AbsencesTable = ({ absences, loading, error }) => {
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-[#262626]">
        <h2 className="text-lg font-semibold">تقارير الغياب ({absences.length})</h2>
      </div>
      
      {absences.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0B0B0B]">
              <tr>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF]">الطالب</th>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden sm:table-cell">النوع</th>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden md:table-cell">من تاريخ</th>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden md:table-cell">إلى تاريخ</th>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF]">الحالة</th>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden lg:table-cell">السبب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {absences.map((absence) => (
                <tr key={absence.id} className="hover:bg-[#0B0B0B]/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{absence.student?.name}</div>
                      <div className="text-[#CFCFCF] text-sm sm:hidden">
                        {absence.type === 'SICK' ? 'مرض' : 
                         absence.type === 'PERSONAL' ? 'شخصي' : 
                         absence.type === 'SCHOOL_EVENT' ? 'نشاط مدرسي' : 'أخرى'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#CFCFCF] hidden sm:table-cell">
                    {absence.type === 'SICK' ? 'مرض' : 
                     absence.type === 'PERSONAL' ? 'شخصي' : 
                     absence.type === 'SCHOOL_EVENT' ? 'نشاط مدرسي' : 'أخرى'}
                  </td>
                  <td className="px-6 py-4 text-[#CFCFCF] hidden md:table-cell">
                    {new Date(absence.startDate).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 text-[#CFCFCF] hidden md:table-cell">
                    {new Date(absence.endDate).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      absence.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                      absence.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {absence.status === 'APPROVED' ? 'مُوافق عليه' :
                       absence.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#CFCFCF] hidden lg:table-cell max-w-xs truncate">
                    {absence.reason || 'لا يوجد'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-[#CFCFCF]">
          لا توجد تقارير غياب
        </div>
      )}
    </div>
  )
}

// Permissions Table Component
const PermissionsTable = ({ permissions, loading, error }) => {
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-[#262626]">
        <h2 className="text-lg font-semibold">تقارير الأذونات ({permissions.length})</h2>
      </div>
      
      {permissions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0B0B0B]">
              <tr>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF]">الطالب</th>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden sm:table-cell">النوع</th>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden md:table-cell">التاريخ</th>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF]">الحالة</th>
                <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden lg:table-cell">السبب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {permissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-[#0B0B0B]/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{permission.student?.name}</div>
                      <div className="text-[#CFCFCF] text-sm sm:hidden">
                        {permission.type === 'ARRIVAL' ? 'إحضار' : 'استلام'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#CFCFCF] hidden sm:table-cell">
                    {permission.type === 'ARRIVAL' ? 'إحضار' : 'استلام'}
                  </td>
                  <td className="px-6 py-4 text-[#CFCFCF] hidden md:table-cell">
                    {new Date(permission.date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      permission.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                      permission.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {permission.status === 'APPROVED' ? 'مُوافق عليه' :
                       permission.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#CFCFCF] hidden lg:table-cell max-w-xs truncate">
                    {permission.reason || 'لا يوجد'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-[#CFCFCF]">
          لا توجد تقارير أذونات
        </div>
      )}
    </div>
  )
}
