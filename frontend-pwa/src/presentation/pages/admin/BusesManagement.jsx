import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiAdminRepository } from '../../../infrastructure/repositories/ApiAdminRepository.js'
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { Plus, Edit2, Trash2, X, Bus } from 'lucide-react'

// Presentation Page - Buses Management
export const BusesManagement = () => {
  const queryClient = useQueryClient()
  const adminRepo = new ApiAdminRepository()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBus, setEditingBus] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  // Fetch buses
  const { data: buses = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'buses'],
    queryFn: () => adminRepo.getBuses()
  })

  // Fetch supervisors (for supervisor assignment)
  const { data: supervisors = [] } = useQuery({
    queryKey: ['admin', 'supervisors'],
    queryFn: () => adminRepo.getSupervisors()
  })

  // Create bus mutation
  const createBusMutation = useMutation({
    mutationFn: (busData) => adminRepo.createBus(busData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'buses'])
      setShowCreateModal(false)
    }
  })

  // Update bus mutation
  const updateBusMutation = useMutation({
    mutationFn: ({ busId, busData }) => adminRepo.updateBus(busId, busData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'buses'])
      setEditingBus(null)
    }
  })

  // Delete bus mutation
  const deleteBusMutation = useMutation({
    mutationFn: (busId) => adminRepo.deleteBus(busId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'buses'])
      setShowDeleteConfirm(null)
    }
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">إدارة الحافلات</h1>
          <p className="text-[#CFCFCF] mt-1">إدارة أسطول الحافلات وتخصيص المشرفين</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark rounded-xl font-medium transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          إضافة حافلة جديدة
        </button>
      </div>

      {/* Buses Grid */}
      {buses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <div key={bus.id} className="bg-[#141414] border border-[#262626] rounded-2xl p-6 hover:border-brand/30 transition-colors">
              {/* Bus Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{bus.busNumber}</h3>
                  {bus.licensePlate && (
                    <p className="text-[#CFCFCF] text-sm">{bus.licensePlate}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  bus.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                  bus.status === 'MAINTENANCE' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {bus.status === 'ACTIVE' ? 'نشط' : 
                   bus.status === 'MAINTENANCE' ? 'صيانة' : 'غير نشط'}
                </span>
              </div>

              {/* Bus Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#CFCFCF]">السعة:</span>
                  <span className="text-white">{bus.capacity} مقعد</span>
                </div>
                
                {bus.model && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#CFCFCF]">الموديل:</span>
                    <span className="text-white">{bus.model} ({bus.year})</span>
                  </div>
                )}

                {bus.supervisor?.user? (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#CFCFCF]">المشرف:</span>
                    <span className="text-white">{bus.supervisor.user.name}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#CFCFCF]">المشرف:</span>
                    <span className="text-red-400">غير مخصص</span>
                  </div>
                )}

                {bus.driverName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#CFCFCF]">السائق:</span>
                    <span className="text-white">{bus.driverName}</span>
                  </div>
                )}

                {bus.students && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#CFCFCF]">عدد الطلاب:</span>
                    <span className="text-white">{bus.students.length}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingBus(bus)}
                  className="flex-1 px-4 py-2 text-blue-400 border border-blue-400/20 hover:bg-blue-500/20 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  تعديل
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(bus)}
                  className="flex-1 px-4 py-2 text-red-400 border border-red-400/20 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 text-center">
          <p className="text-[#CFCFCF]">لا توجد حافلات مسجلة</p>
        </div>
      )}

      {/* Create Bus Modal */}
      {showCreateModal && (
        <BusModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={createBusMutation.mutate}
          loading={createBusMutation.isPending}
          error={createBusMutation.error?.message}
          supervisors={supervisors}
        />
      )}

      {/* Edit Bus Modal */}
      {editingBus && (
        <BusModal
          bus={editingBus}
          onClose={() => setEditingBus(null)}
          onSubmit={(busData) => updateBusMutation.mutate({ 
            busId: editingBus.id, 
            busData 
          })}
          loading={updateBusMutation.isPending}
          error={updateBusMutation.error?.message}
          supervisors={supervisors}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          bus={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => deleteBusMutation.mutate(showDeleteConfirm.id)}
          loading={deleteBusMutation.isPending}
        />
      )}
    </div>
  )
}

// Bus Modal Component
const BusModal = ({ bus, onClose, onSubmit, loading, error, supervisors }) => {
  const [formData, setFormData] = useState({
    busNumber: bus?.busNumber || '',
    licensePlate: bus?.licensePlate || '',
    capacity: bus?.capacity || '',
    model: bus?.model || '',
    year: bus?.year || '',
    driverName: bus?.driverName || '',
    driverPhone: bus?.driverPhone || '',
    driverLicenseNumber: bus?.driverLicenseNumber || '',
    status: bus?.status || 'ACTIVE',
    supervisorId: bus?.supervisorId || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert numeric fields
    const submitData = {
      ...formData,
      capacity: parseInt(formData.capacity),
      year: formData.year ? parseInt(formData.year) : null,
      supervisorId: formData.supervisorId || null
    }
    
    onSubmit(submitData)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {bus ? 'تعديل بيانات الحافلة' : 'إضافة حافلة جديدة'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-[#CFCFCF] hover:text-white rounded-lg hover:bg-[#0B0B0B]"
            >
              <X size={20} />
            </button>
          </div>

          {error && <ErrorMessage message={error} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">المعلومات الأساسية</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#CFCFCF] mb-2">رقم الحافلة</label>
                  <input
                    type="text"
                    value={formData.busNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, busNumber: e.target.value }))}
                    required
                    placeholder="مثال: Bus-001"
                    className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CFCFCF] mb-2">رقم اللوحة</label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value }))}
                    placeholder="مثال: 9879 اب"
                    className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CFCFCF] mb-2">السعة</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    required
                    min="1"
                    placeholder="30"
                    className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  >
                    <option value="ACTIVE">نشط</option>
                    <option value="INACTIVE">غير نشط</option>
                    <option value="MAINTENANCE">صيانة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الموديل</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="مثال: Toyota"
                    className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CFCFCF] mb-2">سنة الصنع</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    min="1990"
                    max="2030"
                    placeholder="2022"
                    className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>
              </div>
            </div>

            {/* Supervisor Assignment */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">تخصيص المشرف</h4>
              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">المشرف المسؤول</label>
                <select
                  value={formData.supervisorId}
                  onChange={(e) => setFormData(prev => ({ ...prev, supervisorId: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  <option value="">لا يوجد مشرف</option>
                  {supervisors.map((supervisor) => {
                    const isAssignedElsewhere = Boolean(supervisor.bus && (!bus || supervisor.bus.id !== bus.id));
                    return (
                      <option
                        key={supervisor.id}
                        value={supervisor.userId}
                        disabled={isAssignedElsewhere}
                      >
                        {supervisor.user.name} 
                        {isAssignedElsewhere ? ' (مخصص لحافلة أخرى)' : ''}
                      </option>
                    );
                  })}
                </select>
                {supervisors.some(s => s.bus) && (
                  <p className="text-xs text-[#CFCFCF] mt-2">المشرفون المخصصون لحافلات أخرى يظهرون كغير متاحين.</p>
                )}
              </div>
            </div>

            {/* Driver Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">معلومات السائق</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#CFCFCF] mb-2">اسم السائق</label>
                  <input
                    type="text"
                    value={formData.driverName}
                    onChange={(e) => setFormData(prev => ({ ...prev, driverName: e.target.value }))}
                    placeholder="أحمد محمد"
                    className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CFCFCF] mb-2">رقم هاتف السائق</label>
                  <input
                    type="tel"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, driverPhone: e.target.value }))}
                    placeholder="+968 12345678"
                    className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#CFCFCF] mb-2">رقم رخصة السائق</label>
                  <input
                    type="text"
                    value={formData.driverLicenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, driverLicenseNumber: e.target.value }))}
                    placeholder="DL-123456"
                    className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-[#262626] hover:bg-[#0B0B0B] rounded-xl font-medium transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-brand hover:bg-brand-dark disabled:opacity-50 rounded-xl font-medium transition-colors"
              >
                {loading ? <LoadingSpinner size="sm" /> : (bus ? 'تحديث' : 'إضافة')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
const DeleteConfirmModal = ({ bus, onClose, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-sm">
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">تأكيد الحذف</h3>
          <p className="text-[#CFCFCF] mb-6">
            هل تريد حذف الحافلة <span className="text-white font-medium">{bus.busNumber}</span>؟
            هذا الإجراء لا يمكن التراجع عنه.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-[#262626] hover:bg-[#0B0B0B] rounded-xl font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-xl font-medium transition-colors"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'حذف'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
