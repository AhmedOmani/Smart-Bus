import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiAuthRepository } from '../../../infrastructure/repositories/ApiAuthRepository.js'
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { 
  Settings, 
  School, 
  Bell, 
  Shield, 
  Database, 
  Save, 
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Clock,
  Key,
  HardDrive,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

// Presentation Page - Settings Management
export const SettingsManagement = () => {
  const queryClient = useQueryClient()
  const authRepo = new ApiAuthRepository()
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState('')

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'مدرسة العصر الحديث الخاصة',
    schoolAddress: 'مسقط، سلطنة عمان',
    schoolPhone: '+968 24 123456',
    schoolEmail: 'info@modernschool.om',
    principalName: 'أحمد بن محمد السالمي',
    academicYear: '2024/2025',
    timeZone: 'Asia/Muscat'
  })

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    parentNotifications: true,
    supervisorNotifications: true,
    emergencyAlerts: true,
    dailyReports: false,
    weeklyReports: true,
    busDelayAlerts: true
  })

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '60',
    passwordMinLength: '8',
    requireSpecialChars: true,
    requireNumbers: true,
    passwordExpiry: '90',
    maxLoginAttempts: '5',
    twoFactorAuth: false,
    autoLogout: true
  })

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '365',
    apiRateLimit: '1000',
    maxFileSize: '10'
  })

  // Save Settings Mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (settings) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return settings
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin', 'settings'])
      setSaved(variables.type)
      setTimeout(() => setSaved(''), 3000)
    }
  })

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData) => {
      return await authRepo.changePassword(passwordData)
    },
    onSuccess: () => {
      setSaved('password')
      setTimeout(() => setSaved(''), 3000)
    }
  })

  const handlePasswordChangeSuccess = () => {
    // This will be called from the SecuritySettings component
    changePasswordMutation.reset() // Clear any previous errors
  }

  const handleSaveSettings = (type, settings) => {
    saveSettingsMutation.mutate({ type, settings })
  }

  const tabs = [
    { id: 'general', label: 'الإعدادات العامة', icon: School },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'system', label: 'النظام', icon: Database }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand/20 rounded-xl">
          <Settings size={24} className="text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">إعدادات النظام</h1>
          <p className="text-[#CFCFCF] mt-1">
            إدارة وتخصيص إعدادات نظام الحافلات الذكية
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand text-white'
                  : 'text-[#CFCFCF] hover:text-white hover:bg-[#0B0B0B]'
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl">
        {activeTab === 'general' && (
          <GeneralSettings
            settings={generalSettings}
            setSettings={setGeneralSettings}
            onSave={(settings) => handleSaveSettings('general', settings)}
            loading={saveSettingsMutation.isPending}
            saved={saved === 'general'}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationSettings
            settings={notificationSettings}
            setSettings={setNotificationSettings}
            onSave={(settings) => handleSaveSettings('notifications', settings)}
            loading={saveSettingsMutation.isPending}
            saved={saved === 'notifications'}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySettings
            settings={securitySettings}
            setSettings={setSecuritySettings}
            onSave={(settings) => handleSaveSettings('security', settings)}
            loading={saveSettingsMutation.isPending}
            saved={saved === 'security'}
            onChangePassword={changePasswordMutation.mutate}
            changePasswordLoading={changePasswordMutation.isPending}
            changePasswordError={changePasswordMutation.error?.message}
            passwordSaved={saved === 'password'}
          />
        )}

        {activeTab === 'system' && (
          <SystemSettings
            settings={systemSettings}
            setSettings={setSystemSettings}
            onSave={(settings) => handleSaveSettings('system', settings)}
            loading={saveSettingsMutation.isPending}
            saved={saved === 'system'}
          />
        )}
      </div>
    </div>
  )
}

// General Settings Component
const GeneralSettings = ({ settings, setSettings, onSave, loading, saved }) => {
  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <School size={20} />
          الإعدادات العامة
        </h2>
        {saved && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            تم الحفظ بنجاح
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* School Information */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">معلومات المدرسة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                اسم المدرسة
              </label>
              <input
                type="text"
                value={settings.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                اسم المدير
              </label>
              <input
                type="text"
                value={settings.principalName}
                onChange={(e) => handleChange('principalName', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2 flex items-center gap-2">
                <MapPin size={16} />
                عنوان المدرسة
              </label>
              <input
                type="text"
                value={settings.schoolAddress}
                onChange={(e) => handleChange('schoolAddress', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2 flex items-center gap-2">
                <Phone size={16} />
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={settings.schoolPhone}
                onChange={(e) => handleChange('schoolPhone', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2 flex items-center gap-2">
                <Mail size={16} />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={settings.schoolEmail}
                onChange={(e) => handleChange('schoolEmail', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                العام الدراسي
              </label>
              <input
                type="text"
                value={settings.academicYear}
                onChange={(e) => handleChange('academicYear', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2 flex items-center gap-2">
                <Clock size={16} />
                المنطقة الزمنية
              </label>
              <select
                value={settings.timeZone}
                onChange={(e) => handleChange('timeZone', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                <option value="Asia/Muscat">مسقط (UTC+4)</option>
                <option value="Asia/Dubai">دبي (UTC+4)</option>
                <option value="Asia/Riyadh">الرياض (UTC+3)</option>
                <option value="Asia/Kuwait">الكويت (UTC+3)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-[#262626]">
          <button
            onClick={() => onSave(settings)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark disabled:opacity-50 rounded-xl font-medium transition-colors"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save size={18} />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Notification Settings Component
const NotificationSettings = ({ settings, setSettings, onSave, loading, saved }) => {
  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const notificationGroups = [
    {
      title: 'الإشعارات العامة',
      items: [
        { key: 'emailNotifications', label: 'إشعارات البريد الإلكتروني', description: 'استقبال الإشعارات عبر البريد الإلكتروني' },
        { key: 'smsNotifications', label: 'إشعارات الرسائل النصية', description: 'استقبال الإشعارات عبر الرسائل النصية' },
        { key: 'emergencyAlerts', label: 'تنبيهات الطوارئ', description: 'إشعارات فورية للحالات الطارئة' }
      ]
    },
    {
      title: 'إشعارات المستخدمين',
      items: [
        { key: 'parentNotifications', label: 'إشعارات أولياء الأمور', description: 'إرسال إشعارات لأولياء الأمور' },
        { key: 'supervisorNotifications', label: 'إشعارات المشرفين', description: 'إرسال إشعارات للمشرفين' },
        { key: 'busDelayAlerts', label: 'تنبيهات تأخير الحافلات', description: 'إشعارات عند تأخير الحافلات' }
      ]
    },
    {
      title: 'التقارير الدورية',
      items: [
        { key: 'dailyReports', label: 'التقارير اليومية', description: 'إرسال تقارير يومية للإدارة' },
        { key: 'weeklyReports', label: 'التقارير الأسبوعية', description: 'إرسال تقارير أسبوعية للإدارة' }
      ]
    }
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Bell size={20} />
          إعدادات الإشعارات
        </h2>
        {saved && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            تم الحفظ بنجاح
          </div>
        )}
      </div>

      <div className="space-y-8">
        {notificationGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-lg font-medium text-white mb-4">{group.title}</h3>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl"
                >
                  <div className="flex-1">
                    <div className="text-white font-medium">{item.label}</div>
                    <div className="text-sm text-[#CFCFCF] mt-1">{item.description}</div>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings[item.key] ? 'bg-brand' : 'bg-[#262626]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-[#262626]">
          <button
            onClick={() => onSave(settings)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark disabled:opacity-50 rounded-xl font-medium transition-colors"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save size={18} />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Security Settings Component
const SecuritySettings = ({ 
  settings, 
  setSettings, 
  onSave, 
  loading, 
  saved, 
  onChangePassword, 
  changePasswordLoading, 
  changePasswordError, 
  passwordSaved 
}) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordFormError, setPasswordFormError] = useState('')

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
    setPasswordFormError('') // Clear error on input change
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordFormError('جميع الحقول مطلوبة')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordFormError('كلمة المرور الجديدة وتأكيدها غير متطابقين')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordFormError('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      setPasswordFormError('كلمة المرور يجب أن تحتوي على حرف صغير وكبير ورقم')
      return
    }

    // Submit password change
    onChangePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
  }

  // Clear form when password is successfully changed
  useEffect(() => {
    if (passwordSaved) {
      const timer = setTimeout(() => {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [passwordSaved])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Shield size={20} />
          إعدادات الأمان
        </h2>
        {saved && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            تم الحفظ بنجاح
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Change Password */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Key size={18} />
            تغيير كلمة المرور
          </h3>
          
          <form onSubmit={handlePasswordSubmit} className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-6">
            {passwordSaved && (
              <div className="mb-4 flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle size={16} />
                تم تغيير كلمة المرور بنجاح
              </div>
            )}
            
            {(passwordFormError || changePasswordError) && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertTriangle size={16} />
                  {passwordFormError || changePasswordError}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="أدخل كلمة المرور الحالية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="أدخل كلمة المرور الجديدة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="أعد إدخال كلمة المرور"
                />
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <h4 className="text-blue-400 font-medium mb-2">متطلبات كلمة المرور:</h4>
              <ul className="text-sm text-[#CFCFCF] space-y-1">
                <li>• 8 أحرف على الأقل</li>
                <li>• حرف كبير وحرف صغير</li>
                <li>• رقم واحد على الأقل</li>
              </ul>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={changePasswordLoading}
                className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark disabled:opacity-50 rounded-xl font-medium transition-colors"
              >
                {changePasswordLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Key size={18} />
                    تغيير كلمة المرور
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Password Policy */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Key size={18} />
            سياسة كلمات المرور
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                الحد الأدنى لطول كلمة المرور
              </label>
              <input
                type="number"
                min="6"
                max="20"
                value={settings.passwordMinLength}
                onChange={(e) => handleChange('passwordMinLength', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                انتهاء صلاحية كلمة المرور (بالأيام)
              </label>
              <input
                type="number"
                min="30"
                max="365"
                value={settings.passwordExpiry}
                onChange={(e) => handleChange('passwordExpiry', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                عدد محاولات تسجيل الدخول
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleChange('maxLoginAttempts', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                انتهاء الجلسة (بالدقائق)
              </label>
              <input
                type="number"
                min="15"
                max="480"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl">
              <div>
                <div className="text-white font-medium">الأحرف الخاصة مطلوبة</div>
                <div className="text-sm text-[#CFCFCF]">إجبار استخدام الأحرف الخاصة في كلمات المرور</div>
              </div>
              <button
                onClick={() => handleToggle('requireSpecialChars')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.requireSpecialChars ? 'bg-brand' : 'bg-[#262626]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.requireSpecialChars ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl">
              <div>
                <div className="text-white font-medium">الأرقام مطلوبة</div>
                <div className="text-sm text-[#CFCFCF]">إجبار استخدام الأرقام في كلمات المرور</div>
              </div>
              <button
                onClick={() => handleToggle('requireNumbers')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.requireNumbers ? 'bg-brand' : 'bg-[#262626]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.requireNumbers ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl">
              <div>
                <div className="text-white font-medium">المصادقة الثنائية</div>
                <div className="text-sm text-[#CFCFCF]">تفعيل المصادقة الثنائية للمشرفين</div>
              </div>
              <button
                onClick={() => handleToggle('twoFactorAuth')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorAuth ? 'bg-brand' : 'bg-[#262626]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl">
              <div>
                <div className="text-white font-medium">تسجيل الخروج التلقائي</div>
                <div className="text-sm text-[#CFCFCF]">تسجيل الخروج التلقائي عند انتهاء المدة</div>
              </div>
              <button
                onClick={() => handleToggle('autoLogout')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoLogout ? 'bg-brand' : 'bg-[#262626]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoLogout ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-[#262626]">
          <button
            onClick={() => onSave(settings)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark disabled:opacity-50 rounded-xl font-medium transition-colors"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save size={18} />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// System Settings Component
const SystemSettings = ({ settings, setSettings, onSave, loading, saved }) => {
  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleBackup = () => {
    // Simulate backup process
    alert('جاري إنشاء نسخة احتياطية...')
  }

  const handleRestore = () => {
    // Simulate restore process
    if (confirm('هل أنت متأكد من استعادة النسخة الاحتياطية؟ سيتم فقدان البيانات الحالية.')) {
      alert('جاري استعادة النسخة الاحتياطية...')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Database size={20} />
          إعدادات النظام
        </h2>
        {saved && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            تم الحفظ بنجاح
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* System Status */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">حالة النظام</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl">
              <div>
                <div className="text-white font-medium">وضع الصيانة</div>
                <div className="text-sm text-[#CFCFCF]">إيقاف النظام مؤقتاً للصيانة</div>
              </div>
              <button
                onClick={() => handleToggle('maintenanceMode')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-yellow-500' : 'bg-[#262626]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl">
              <div>
                <div className="text-white font-medium">وضع التطوير</div>
                <div className="text-sm text-[#CFCFCF]">عرض معلومات التطوير والأخطاء</div>
              </div>
              <button
                onClick={() => handleToggle('debugMode')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.debugMode ? 'bg-brand' : 'bg-[#262626]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.debugMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <HardDrive size={18} />
            إعدادات النسخ الاحتياطي
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                تكرار النسخ الاحتياطي
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleChange('backupFrequency', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                <option value="hourly">كل ساعة</option>
                <option value="daily">يومي</option>
                <option value="weekly">أسبوعي</option>
                <option value="monthly">شهري</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                مدة الاحتفاظ بالبيانات (بالأيام)
              </label>
              <input
                type="number"
                min="30"
                max="3650"
                value={settings.dataRetention}
                onChange={(e) => handleChange('dataRetention', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                حد معدل API (طلبات/دقيقة)
              </label>
              <input
                type="number"
                min="100"
                max="10000"
                value={settings.apiRateLimit}
                onChange={(e) => handleChange('apiRateLimit', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                حجم الملف الأقصى (MB)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.maxFileSize}
                onChange={(e) => handleChange('maxFileSize', e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl mb-4">
            <div>
              <div className="text-white font-medium">النسخ الاحتياطي التلقائي</div>
              <div className="text-sm text-[#CFCFCF]">تفعيل النسخ الاحتياطي التلقائي للبيانات</div>
            </div>
            <button
              onClick={() => handleToggle('autoBackup')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoBackup ? 'bg-brand' : 'bg-[#262626]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Backup Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleBackup}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-colors"
            >
              <Download size={18} />
              إنشاء نسخة احتياطية
            </button>

            <button
              onClick={handleRestore}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/30 rounded-xl transition-colors"
            >
              <Upload size={18} />
              استعادة نسخة احتياطية
            </button>
          </div>

          {/* Warning */}
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-400 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-400 font-semibold mb-1">تحذير مهم</p>
                <p className="text-[#CFCFCF]">
                  تأكد من إنشاء نسخة احتياطية قبل تغيير أي إعدادات هامة. استعادة النسخة الاحتياطية ستحذف جميع البيانات الحالية.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-[#262626]">
          <button
            onClick={() => onSave(settings)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark disabled:opacity-50 rounded-xl font-medium transition-colors"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save size={18} />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
