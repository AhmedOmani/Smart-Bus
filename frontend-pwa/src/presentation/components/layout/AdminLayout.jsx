import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { 
  LayoutDashboard, 
  Users, 
  Bus, 
  GraduationCap, 
  FileBarChart, 
  KeyRound, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  School
} from 'lucide-react'

// Presentation Component - Admin Layout
export const AdminLayout = () => {
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    await logout()
    setShowLogoutConfirm(false)
  }

  const navigationItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { to: '/admin/users', icon: Users, label: 'المستخدمون' },
    { to: '/admin/buses', icon: Bus, label: 'الحافلات' },
    { to: '/admin/students', icon: GraduationCap, label: 'الطلاب' },
    { to: '/admin/reports', icon: FileBarChart, label: 'التقارير' },
    { to: '/admin/credentials', icon: KeyRound, label: 'بيانات المستخدمين' },
    { to: '/admin/settings', icon: Settings, label: 'الإعدادات' }
  ]

  return (
    <div className="min-h-screen flex flex-col text-white bg-[#0B0B0B]">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 border-b border-[#262626] bg-[#141414] min-h-16">
        {/* Menu Button (Mobile - On the right in RTL) */}
        <button
          className="md:hidden p-2 rounded-xl bg-[#0B0B0B] border border-[#262626] hover:bg-[#1b1b1b] transition-colors"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Brand (Center) */}
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="مدرسة العصر الحديث" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-semibold hidden sm:block">مدرسة العهد الحديث الخاصة</span>
        </div>

        {/* Logout Button (On the left in RTL) */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-2 p-2 rounded-xl border border-[#262626] hover:bg-[#1b1b1b] hover:border-brand/30 transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm hidden sm:block">تسجيل الخروج</span>
        </button>
      </header>

      <div className="flex flex-1 min-h-0 flex-row-reverse">
        {/* Desktop Sidebar (On the right in RTL) */}
        <aside className="hidden md:block w-64 p-4 bg-[#141414] border-r border-[#262626] space-y-2">          <Navigation items={navigationItems} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setMenuOpen(false)}>
          <nav className="absolute inset-y-0 right-0 w-72 bg-[#141414] border-l border-[#262626] p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-lg">القائمة</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-brand hover:bg-brand-dark flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <Navigation items={navigationItems} onItemClick={() => setMenuOpen(false)} />
          </nav>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setShowLogoutConfirm(false)}>
          <div className="absolute bottom-0 inset-x-0 m-4 p-6 rounded-2xl bg-[#141414] border border-[#262626]" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold mb-2">تأكيد تسجيل الخروج</h3>
              <p className="text-[#CFCFCF] text-sm">هل تريد الخروج من الحساب الآن؟</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-[#0B0B0B] border border-[#262626] hover:bg-[#1b1b1b] rounded-xl font-medium"
              >
                إلغاء
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-brand hover:bg-brand-dark rounded-xl font-medium"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Navigation = ({ items, onItemClick }) => {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onItemClick}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
              isActive
                ? 'bg-brand/20 border border-brand/30 text-brand'
                : 'hover:bg-[#0B0B0B] border border-transparent hover:border-[#262626]'
            }`
          }
        >
          <item.icon size={20} className="flex-shrink-0" />
          <span className="font-medium">{item.label}</span>
        </NavLink>
      ))}
    </div>
  )
}
