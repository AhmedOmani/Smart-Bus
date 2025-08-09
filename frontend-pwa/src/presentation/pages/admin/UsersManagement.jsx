import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiAdminRepository } from '../../../infrastructure/repositories/ApiAdminRepository.js'
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { Plus, Edit2, Trash2, X, Copy, Check, KeyRound, AlertTriangle } from 'lucide-react'

// Presentation Page - Users Management
export const UsersManagement = () => {
  const queryClient = useQueryClient()
  const adminRepo = new ApiAdminRepository()
  
  const [searchFilters, setSearchFilters] = useState({
    role: '',
    status: '',
    search: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showCredentials, setShowCredentials] = useState(null)

  // Fetch users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminRepo.getUsers()
  })

  // Search users
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['admin', 'users', 'search', searchFilters],
    queryFn: () => adminRepo.searchUsers(searchFilters),
    enabled: !!(searchFilters.role || searchFilters.status || searchFilters.search)
  })

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData) => adminRepo.createUser(userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['admin', 'users'])
      setShowCreateModal(false)
      // Show credentials modal with the returned credentials
      setShowCredentials({
        user: data.user,
        credentials: data.credentials
      })
    }
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) => adminRepo.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'users'])
      setEditingUser(null)
    }
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => adminRepo.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'users'])
      setShowDeleteConfirm(null)
    }
  })

  const displayUsers = (searchFilters.role || searchFilters.status || searchFilters.search) 
    ? searchResults 
    : users

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">إدارة المستخدمين</h1>
          <p className="text-[#CFCFCF] mt-1">إدارة حسابات المستخدمين والمشرفين والأولياء</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark rounded-xl font-medium transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          إضافة مستخدم جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">البحث والتصفية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">نوع المستخدم</label>
            <select
              value={searchFilters.role}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
            >
              <option value="">جميع الأنواع</option>
              <option value="ADMIN">مدير</option>
              <option value="SUPERVISOR">مشرف</option>
              <option value="PARENT">ولي أمر</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الحالة</label>
            <select
              value={searchFilters.status}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
            >
              <option value="">جميع الحالات</option>
              <option value="ACTIVE">نشط</option>
              <option value="INACTIVE">غير نشط</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">البحث</label>
            <input
              type="text"
              value={searchFilters.search}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
              className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
          </div>
        </div>
        
        {(searchFilters.role || searchFilters.status || searchFilters.search) && (
          <button
            onClick={() => setSearchFilters({ role: '', status: '', search: '' })}
            className="mt-4 px-4 py-2 text-sm text-brand hover:text-brand-dark border border-brand/20 rounded-lg hover:bg-brand/10 transition-colors"
          >
            مسح الفلاتر
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#262626]">
          <h2 className="text-lg font-semibold">
            قائمة المستخدمين ({displayUsers.length})
            {isSearching && <span className="text-sm text-[#CFCFCF] mr-2">(جاري البحث...)</span>}
          </h2>
        </div>
        
        {displayUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0B0B0B]">
                <tr>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF]">الاسم</th>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden sm:table-cell">البريد الإلكتروني</th>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF]">النوع</th>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF] hidden md:table-cell">الحالة</th>
                  <th className="px-6 py-4 text-start text-sm font-medium text-[#CFCFCF]">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {displayUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#0B0B0B]/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-[#CFCFCF] text-sm sm:hidden">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#CFCFCF] hidden sm:table-cell">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                        user.role === 'SUPERVISOR' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {user.role === 'ADMIN' ? 'مدير' : user.role === 'SUPERVISOR' ? 'مشرف' : 'ولي أمر'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit2 size={16} />
                        </button>
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => setShowDeleteConfirm(user)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-[#CFCFCF]">
            لا توجد مستخدمين
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <UserModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={createUserMutation.mutate}
          loading={createUserMutation.isPending}
          error={createUserMutation.error?.message}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <UserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={(userData) => updateUserMutation.mutate({ userId: editingUser.id, userData })}
          loading={updateUserMutation.isPending}
          error={updateUserMutation.error?.message}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          user={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => deleteUserMutation.mutate(showDeleteConfirm.id)}
          loading={deleteUserMutation.isPending}
        />
      )}

      {/* Credentials Display Modal */}
      {showCredentials && (
        <CredentialsModal
          userData={showCredentials}
          onClose={() => setShowCredentials(null)}
        />
      )}
    </div>
  )
}

// User Modal Component
const UserModal = ({ user, onClose, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    nationalId: user?.nationalId || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'PARENT'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {user ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-[#CFCFCF] hover:text-white rounded-lg hover:bg-[#0B0B0B]"
            >
              <X size={20} />
            </button>
          </div>

          {error && <ErrorMessage message={error} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الاسم</label>
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
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">نوع المستخدم</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                <option value="PARENT">ولي أمر</option>
                <option value="SUPERVISOR">مشرف</option>
                <option value="ADMIN">مدير</option>
              </select>
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
                {loading ? <LoadingSpinner size="sm" /> : (user ? 'تحديث' : 'إضافة')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
const DeleteConfirmModal = ({ user, onClose, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-sm">
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">تأكيد الحذف</h3>
          <p className="text-[#CFCFCF] mb-6">
            هل تريد حذف المستخدم <span className="text-white font-medium">{user.name}</span>؟
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

// Credentials Display Modal
const CredentialsModal = ({ userData, onClose }) => {
  const [copied, setCopied] = useState('')

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const copyAllCredentials = async () => {
    const credentialsText = `المعلومات الشخصية:
الاسم: ${userData.user.name}
البريد الإلكتروني: ${userData.user.email}
النوع: ${userData.user.role === 'ADMIN' ? 'مدير' : userData.user.role === 'SUPERVISOR' ? 'مشرف' : 'ولي أمر'}

بيانات تسجيل الدخول:
اسم المستخدم: ${userData.credentials.username}
كلمة المرور: ${userData.credentials.password}

رابط النظام: ${window.location.origin}/login`

    await copyToClipboard(credentialsText, 'all')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">تم إنشاء المستخدم بنجاح! 🎉</h3>
            <button
              onClick={onClose}
              className="p-2 text-[#CFCFCF] hover:text-white rounded-lg hover:bg-[#0B0B0B]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-4">
              <h4 className="text-lg font-semibold text-white mb-3">معلومات المستخدم</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#CFCFCF]">الاسم:</span>
                  <span className="text-white">{userData.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#CFCFCF]">البريد الإلكتروني:</span>
                  <span className="text-white">{userData.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#CFCFCF]">النوع:</span>
                  <span className="text-white">
                    {userData.user.role === 'ADMIN' ? 'مدير' : 
                     userData.user.role === 'SUPERVISOR' ? 'مشرف' : 'ولي أمر'}
                  </span>
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                <KeyRound size={20} />
                بيانات تسجيل الدخول
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-[#CFCFCF] mb-1">اسم المستخدم</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg text-white font-mono">
                      {userData.credentials.username}
                    </div>
                    <button
                      onClick={() => copyToClipboard(userData.credentials.username, 'username')}
                      className="px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                    >
                      {copied === 'username' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#CFCFCF] mb-1">كلمة المرور</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg text-white font-mono">
                      {userData.credentials.password}
                    </div>
                    <button
                      onClick={() => copyToClipboard(userData.credentials.password, 'password')}
                      className="px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                    >
                      {copied === 'password' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-400 font-semibold mb-1">تنبيه هام</p>
                  <p className="text-[#CFCFCF]">
                    احفظ هذه البيانات في مكان آمن وأرسلها للمستخدم. لن تتمكن من رؤية كلمة المرور مرة أخرى.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={copyAllCredentials}
                className="flex-1 py-3 bg-brand hover:bg-brand-dark rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {copied === 'all' ? (
                  <>
                    <Check size={20} />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    نسخ جميع البيانات
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-[#262626] hover:bg-[#0B0B0B] rounded-xl font-medium transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
