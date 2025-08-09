import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ApiAdminRepository } from '../../../infrastructure/repositories/ApiAdminRepository.js'
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { KeyRound, Copy, Check, Search, Filter, User, Shield, UserCheck } from 'lucide-react'

const adminRepo = new ApiAdminRepository()

export const CredentialsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [copied, setCopied] = useState('')

  // Fetch all credentials
  const { data: credentials = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'credentials'],
    queryFn: () => adminRepo.getAllCredentials()
  })

  // Filter credentials based on search and filters
  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = !searchTerm || 
      credential.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.username.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = !roleFilter || credential.user.role === roleFilter
    const matchesStatus = !statusFilter || credential.user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const copyToClipboard = async (text, type, credentialId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(`${type}-${credentialId}`)
      setTimeout(() => setCopied(''), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const copyAllCredential = async (credential) => {
    const credentialsText = `المعلومات الشخصية:
الاسم: ${credential.user.name}
البريد الإلكتروني: ${credential.user.email}
النوع: ${credential.user.role === 'ADMIN' ? 'مدير' : credential.user.role === 'SUPERVISOR' ? 'مشرف' : 'ولي أمر'}

بيانات تسجيل الدخول:
اسم المستخدم: ${credential.username}
كلمة المرور: ${credential.password}

رابط النظام: ${window.location.origin}/login

تاريخ الإنشاء: ${new Date(credential.createdAt).toLocaleDateString('ar-EG')}`

    await copyToClipboard(credentialsText, 'all', credential.id)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleLabel = (role) => {
    switch(role) {
      case 'ADMIN': return 'مدير'
      case 'SUPERVISOR': return 'مشرف'
      case 'PARENT': return 'ولي أمر'
      default: return role
    }
  }

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    if (status === 'ACTIVE') {
      return `${baseClasses} bg-green-500/20 text-green-400`
    }
    return `${baseClasses} bg-red-500/20 text-red-400`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand/20 rounded-xl">
            <KeyRound size={24} className="text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">إدارة بيانات المستخدمين</h1>
            <p className="text-[#CFCFCF] mt-1">
              عرض وإدارة جميع بيانات تسجيل الدخول للمستخدمين
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-[#CFCFCF]">
          <span>إجمالي البيانات:</span>
          <span className="text-brand font-semibold">{filteredCredentials.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              البحث
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث بالاسم، البريد الإلكتروني، أو اسم المستخدم..."
              className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg text-white focus:border-brand focus:outline-none"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              النوع
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg text-white focus:border-brand focus:outline-none"
            >
              <option value="">جميع الأنواع</option>
              <option value="ADMIN">مدير</option>
              <option value="SUPERVISOR">مشرف</option>
              <option value="PARENT">ولي أمر</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              الحالة
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg text-white focus:border-brand focus:outline-none"
            >
              <option value="">جميع الحالات</option>
              <option value="ACTIVE">نشط</option>
              <option value="INACTIVE">غير نشط</option>
            </select>
          </div>
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCredentials.map((credential) => (
          <div
            key={credential.id}
            className="bg-[#141414] border border-[#262626] rounded-xl p-6 hover:border-[#383838] transition-colors"
          >
            {/* User Info Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {credential.user.name}
                  </h3>
                  <span className={getStatusBadge(credential.user.status)}>
                    {credential.user.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                <p className="text-[#CFCFCF] text-sm">{credential.user.email}</p>
                <p className="text-brand text-sm font-medium">
                  {getRoleLabel(credential.user.role)}
                </p>
              </div>
              
              <button
                onClick={() => copyAllCredential(credential)}
                className="p-2 text-[#CFCFCF] hover:text-white hover:bg-[#0B0B0B] rounded-lg transition-colors"
                title="نسخ جميع البيانات"
              >
                {copied === `all-${credential.id}` ? 
                  <Check size={18} className="text-green-400" /> : 
                  <Copy size={18} />
                }
              </button>
            </div>

            {/* Credentials */}
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs text-[#CFCFCF] mb-1">
                  اسم المستخدم
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg text-white text-sm font-mono">
                    {credential.username}
                  </div>
                  <button
                    onClick={() => copyToClipboard(credential.username, 'username', credential.id)}
                    className="px-2 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors text-sm"
                  >
                    {copied === `username-${credential.id}` ? 
                      <Check size={16} /> : 
                      <Copy size={16} />
                    }
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-[#CFCFCF] mb-1">
                  كلمة المرور
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg text-white text-sm font-mono">
                    {credential.password}
                  </div>
                  <button
                    onClick={() => copyToClipboard(credential.password, 'password', credential.id)}
                    className="px-2 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors text-sm"
                  >
                    {copied === `password-${credential.id}` ? 
                      <Check size={16} /> : 
                      <Copy size={16} />
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-4 pt-4 border-t border-[#262626] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#CFCFCF]">تاريخ الإنشاء:</span>
                <span className="text-white">{formatDate(credential.createdAt)}</span>
              </div>
              
              {credential.user.lastLoginAt && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#CFCFCF]">آخر تسجيل دخول:</span>
                  <span className="text-white">{formatDate(credential.user.lastLoginAt)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#CFCFCF]">الرقم الوطني:</span>
                <span className="text-white font-mono">{credential.user.nationalId}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCredentials.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#262626] rounded-full flex items-center justify-center">
            <Search size={32} className="text-[#CFCFCF]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">لا توجد بيانات</h3>
          <p className="text-[#CFCFCF]">
            {credentials.length === 0 
              ? 'لم يتم إنشاء أي بيانات تسجيل دخول بعد'
              : 'لا توجد بيانات تطابق معايير البحث المحددة'
            }
          </p>
        </div>
      )}

      {/* Info Card */}
      {credentials.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-lg">ℹ️</span>
            <div className="text-sm">
              <p className="text-blue-400 font-semibold mb-1">معلومات مهمة</p>
              <ul className="text-[#CFCFCF] space-y-1">
                <li>• يمكنك نسخ بيانات المستخدمين لمشاركتها معهم</li>
                <li>• استخدم البحث والفلاتر للعثور على بيانات معينة بسرعة</li>
                <li>• تأكد من حفظ كلمات المرور في مكان آمن</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
