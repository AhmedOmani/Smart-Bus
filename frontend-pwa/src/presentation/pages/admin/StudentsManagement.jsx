import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiAdminRepository } from '../../../infrastructure/repositories/ApiAdminRepository.js'
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { Plus, Edit2, Trash2, X, GraduationCap } from 'lucide-react'

// Presentation Page - Students Management
export const StudentsManagement = () => {
  const queryClient = useQueryClient()
  const adminRepo = new ApiAdminRepository()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  // Fetch students
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'students'],
    queryFn: () => adminRepo.getStudents()
  })

  // Fetch users (for parent selection)
  const { data: users = [] } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminRepo.getUsers()
  })

  // Fetch buses (for bus assignment)
  const { data: buses = [] } = useQuery({
    queryKey: ['admin', 'buses'],
    queryFn: () => adminRepo.getBuses()
  })

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: (studentData) => adminRepo.createStudent(studentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'students'])
      setShowCreateModal(false)
    }
  })

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: ({ studentId, studentData }) => adminRepo.updateStudent(studentId, studentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'students'])
      setEditingStudent(null)
    }
  })

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: (studentId) => adminRepo.deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'students'])
      setShowDeleteConfirm(null)
    }
  })

  const parents = users.filter(user => user.role === 'PARENT')

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">إدارة الطلاب</h1>
          <p className="text-[#CFCFCF] mt-1">إدارة بيانات الطلاب وتخصيص الحافلات</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark rounded-xl font-medium transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          إضافة طالب جديد
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#262626]">
          <h2 className="text-lg font-semibold">قائمة الطلاب ({students.length})</h2>
        </div>
        
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0B0B0B]">
                <tr>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF]">اسم الطالب</th>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden sm:table-cell">الصف</th>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden md:table-cell">ولي الأمر</th>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF]">الحافلة</th>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden lg:table-cell">الحالة</th>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF]">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-[#0B0B0B]/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{student.name}</div>
                        <div className="text-[#CFCFCF] text-sm">{student.nationalId}</div>
                        <div className="text-[#CFCFCF] text-sm sm:hidden">الصف: {student.grade}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#CFCFCF] hidden sm:table-cell">{student.grade}</td>
                    <td className="px-6 py-4 text-[#CFCFCF] hidden md:table-cell">
                      {student.parent?.user?.name || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4">
                      {student.bus ? (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                          {student.bus.busNumber}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                          غير مخصص
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === 'ACTIVE' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {student.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(student)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-[#CFCFCF]">
            لا يوجد طلاب مسجلون
          </div>
        )}
      </div>

      {/* Create Student Modal */}
      {showCreateModal && (
        <StudentModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={createStudentMutation.mutate}
          loading={createStudentMutation.isPending}
          error={createStudentMutation.error?.message}
          parents={parents}
          buses={buses}
        />
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <StudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSubmit={(studentData) => updateStudentMutation.mutate({ 
            studentId: editingStudent.id, 
            studentData 
          })}
          loading={updateStudentMutation.isPending}
          error={updateStudentMutation.error?.message}
          parents={parents}
          buses={buses}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          student={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => deleteStudentMutation.mutate(showDeleteConfirm.id)}
          loading={deleteStudentMutation.isPending}
        />
      )}
    </div>
  )
}

// Student Modal Component
const StudentModal = ({ student, onClose, onSubmit, loading, error, parents, buses }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    nationalId: student?.nationalId || '',
    grade: student?.grade || '',
    parentId: student?.parentId || '',
    busId: student?.busId || '',
    homeAddress: student?.homeAddress || '',
    homeLatitude: student?.homeLatitude || '',
    homeLongitude: student?.homeLongitude || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert coordinates to numbers if provided
    const submitData = {
      ...formData,
      homeLatitude: formData.homeLatitude ? parseFloat(formData.homeLatitude) : null,
      homeLongitude: formData.homeLongitude ? parseFloat(formData.homeLongitude) : null,
      busId: formData.busId || null
    }
    
    onSubmit(submitData)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {student ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">اسم الطالب</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الرقم الوطني</label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الصف الدراسي</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  required
                  placeholder="مثال: الصف الخامس"
                  className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">ولي الأمر</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  <option value="">اختر ولي الأمر</option>
                  {parents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name} - {parent.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الحافلة (اختياري)</label>
                <select
                  value={formData.busId}
                  onChange={(e) => setFormData(prev => ({ ...prev, busId: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  <option value="">لا يوجد حافلة</option>
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.busNumber} - {bus.licensePlate || 'بلا لوحة'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">عنوان المنزل</label>
                <input
                  type="text"
                  value={formData.homeAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, homeAddress: e.target.value }))}
                  placeholder="العنوان التفصيلي للمنزل"
                  className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">خط العرض (اختياري)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.homeLatitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, homeLatitude: e.target.value }))}
                  placeholder="23.58"
                  className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">خط الطول (اختياري)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.homeLongitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, homeLongitude: e.target.value }))}
                  placeholder="58.38"
                  className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
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
                {loading ? <LoadingSpinner size="sm" /> : (student ? 'تحديث' : 'إضافة')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
const DeleteConfirmModal = ({ student, onClose, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-sm">
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">تأكيد الحذف</h3>
          <p className="text-[#CFCFCF] mb-6">
            هل تريد حذف الطالب <span className="text-white font-medium">{student.name}</span>؟
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
