import { useState } from 'react'
import { LoadingSpinner } from '../common/LoadingSpinner.jsx'
import { User, Lock, LogIn, AlertCircle } from 'lucide-react'

// Presentation Component - Login Form
export const LoginForm = ({ onSubmit, loading, error }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(credentials)
  }

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#141414] rounded-2xl border border-[#262626] p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-brand/20 rounded-2xl flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="مدرسة العهد الحديث" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              مدرسة العهد الحديث الخاصة
            </h1>
            <p className="text-[#CFCFCF] text-sm">
              تسجيل الدخول إلى لوحة التحكم
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center gap-2 justify-center">
                <AlertCircle size={16} className="text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <User size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666]" />
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-11 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
                  placeholder="admin"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666]" />
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-11 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <>
                  <LogIn size={20} />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
