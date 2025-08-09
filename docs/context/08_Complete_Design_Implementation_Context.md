# Complete Design & Implementation Context

## 📋 Project Overview

**Project Name:** Smart Bus PWA - School Bus Management System
**Target Users:** School administrators, supervisors, parents
**Language:** Arabic (RTL layout)
**Status:** Production-ready implementation completed

## 🎨 Design System & UI Standards

### Color Palette
```css
Primary Colors:
- Background: #0B0B0B (bg-[#0B0B0B])
- Surface: #141414 (bg-[#141414])
- Border: #262626 (border-[#262626])
- Brand: #C12B2B (bg-brand)
- Brand Dark: #9E1F1F (bg-brand-dark)
- Brand Light: #E05050 (bg-brand-light)

Text Colors:
- Primary: #FFFFFF (text-white)
- Secondary: #CFCFCF (text-[#CFCFCF])
- Muted: #666666 (text-[#666])

Status Colors:
- Success: Green-400/500 (text-green-400, bg-green-500/20)
- Warning: Yellow-400/500 (text-yellow-400, bg-yellow-500/20)
- Error: Red-400/500 (text-red-400, bg-red-500/20)
- Info: Blue-400/500 (text-blue-400, bg-blue-500/20)
```

### Typography
```css
Font Family: 'Almarai', 'Segoe UI', Tahoma, Arial, Helvetica, sans-serif
Font Weights:
- Light: 300
- Normal: 400
- Bold: 700
- Extra Bold: 800

Typography Scale:
- H1: text-2xl sm:text-3xl font-bold
- H2: text-xl font-semibold
- H3: text-lg font-medium
- Body: text-sm, text-base
- Small: text-xs
```

### Layout & Spacing
```css
Container: max-w-7xl mx-auto px-4 py-6 sm:py-8
Spacing Scale: space-y-6, space-y-8, gap-2, gap-3, gap-4, gap-6
Border Radius: rounded-xl (12px), rounded-2xl (16px)
Border Width: border (1px)
```

### Component Patterns
```css
Cards: bg-[#141414] border border-[#262626] rounded-2xl p-6
Buttons: px-6 py-3 rounded-xl font-medium transition-colors
Inputs: px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl
Modals: fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4
Tables: w-full, thead bg-[#0B0B0B], tbody divide-y divide-[#262626]
```

## 🔧 Technical Architecture

### Frontend Stack
```json
{
  "framework": "React 18",
  "bundler": "Vite",
  "styling": "Tailwind CSS",
  "state": "TanStack Query + React useState",
  "routing": "React Router DOM",
  "icons": "Lucide React",
  "font": "Google Fonts (Almarai)",
  "language": "JavaScript (JSX)"
}
```

### Backend Stack
```json
{
  "runtime": "Node.js",
  "framework": "Express.js",
  "database": "PostgreSQL",
  "orm": "Prisma",
  "validation": "Zod",
  "authentication": "JWT",
  "encryption": "bcrypt",
  "websockets": "Socket.io"
}
```

### Project Structure
```
Smart-Bus/
├── frontend-pwa/                 # Main PWA Application
│   ├── src/
│   │   ├── domain/              # Business Logic Layer
│   │   │   ├── entities/        # Domain Models
│   │   │   └── repositories/    # Abstract Interfaces
│   │   ├── infrastructure/      # External Services Layer
│   │   │   └── repositories/    # API Implementations
│   │   ├── application/         # Use Cases Layer
│   │   │   ├── services/
│   │   │   └── usecases/
│   │   ├── presentation/        # UI Layer
│   │   │   ├── components/      # Reusable Components
│   │   │   ├── pages/           # Page Components
│   │   │   ├── hooks/           # Custom Hooks
│   │   │   └── routing/         # Route Protection
│   │   └── lib/                 # Utilities & Configuration
├── backend/                     # API Server
│   └── src/
│       ├── controllers/         # Request Handlers
│       ├── repositories/        # Data Access Layer
│       ├── routes/              # API Routes
│       ├── middlewares/         # Request Middleware
│       ├── utils/               # Helper Functions
│       └── config/              # Configuration
└── docs/                        # Documentation
    └── context/                 # Context Documents
```

## 🎯 Implementation Patterns

### Component Architecture
```jsx
// Standard Component Pattern
export const ComponentName = () => {
  const [state, setState] = useState(initialState)
  const { data, isLoading, error } = useQuery({...})
  const mutation = useMutation({...})

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand/20 rounded-xl">
          <IconComponent size={24} className="text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">العنوان</h1>
          <p className="text-[#CFCFCF] mt-1">الوصف</p>
        </div>
      </div>
      {/* Content */}
    </div>
  )
}
```

### Modal Pattern
```jsx
const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
    <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">العنوان</h3>
          <button onClick={onClose} className="p-2 text-[#CFCFCF] hover:text-white rounded-lg hover:bg-[#0B0B0B]">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  </div>
)
```

### Form Pattern
```jsx
const FormComponent = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({})
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}
      
      <div>
        <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
          التسمية
        </label>
        <input
          className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#262626] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
          {...props}
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-brand hover:bg-brand-dark disabled:opacity-50 rounded-xl font-medium transition-colors"
      >
        {loading ? <LoadingSpinner size="sm" /> : 'حفظ'}
      </button>
    </form>
  )
}
```

## 🌐 RTL & Arabic Implementation

### Global RTL Setup
```css
/* index.css */
html, body, #root {
  direction: rtl;
}

input, textarea, select, th, td {
  text-align: right;
  direction: rtl;
}

/* Tailwind RTL Classes */
.flex-row-reverse  /* For sidebar positioning */
.text-start        /* For table headers */
.pr-10, .pl-3      /* Adjust padding for RTL */
```

### Arabic Text Standards
```javascript
// Standard Arabic Labels
const labels = {
  // Navigation
  dashboard: 'لوحة التحكم',
  users: 'المستخدمون',
  students: 'الطلاب',
  buses: 'الحافلات',
  reports: 'التقارير',
  settings: 'الإعدادات',
  
  // Actions
  add: 'إضافة',
  edit: 'تعديل',
  delete: 'حذف',
  save: 'حفظ',
  cancel: 'إلغاء',
  search: 'البحث',
  
  // Status
  active: 'نشط',
  inactive: 'غير نشط',
  pending: 'قيد المراجعة',
  approved: 'مُوافق عليه',
  rejected: 'مرفوض'
}
```

## 🎨 Icon Implementation

### Icon Library: Lucide React
```jsx
// Standard Icon Imports
import { 
  LayoutDashboard, Users, Bus, GraduationCap, 
  FileBarChart, KeyRound, Settings, LogOut,
  Plus, Edit2, Trash2, Search, Filter,
  Save, Copy, Check, X, AlertTriangle
} from 'lucide-react'

// Icon Usage Pattern
<div className="p-3 bg-brand/20 rounded-xl">
  <IconComponent size={24} className="text-brand" />
</div>

// Button with Icon
<button className="flex items-center gap-2">
  <Plus size={20} />
  إضافة جديد
</button>
```

### Icon Color Coding
```jsx
const iconColors = {
  primary: 'text-brand',
  users: 'text-blue-400',
  students: 'text-green-400', 
  buses: 'text-purple-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
  info: 'text-blue-400'
}
```

## 📱 Responsive Design

### Breakpoint Strategy
```css
/* Mobile First Approach */
.grid-cols-1              /* Mobile */
.sm:grid-cols-2           /* 640px+ */
.md:grid-cols-3           /* 768px+ */
.lg:grid-cols-4           /* 1024px+ */
.xl:grid-cols-6           /* 1280px+ */

/* Common Responsive Patterns */
.flex-col sm:flex-row     /* Stack on mobile, row on desktop */
.hidden sm:table-cell     /* Hide on mobile, show on desktop */
.text-2xl sm:text-3xl     /* Smaller text on mobile */
```

### Mobile Optimizations
```jsx
// Mobile Navigation
const [menuOpen, setMenuOpen] = useState(false)

// Mobile Table Pattern
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr>
        <th className="hidden sm:table-cell">Desktop Only</th>
        <th>Always Visible</th>
      </tr>
    </thead>
  </table>
</div>
```

## 🔧 Data Management

### TanStack Query Patterns
```jsx
// Standard Query
const { data = [], isLoading, error } = useQuery({
  queryKey: ['admin', 'users'],
  queryFn: () => adminRepo.getUsers()
})

// Mutation with Optimistic Updates
const mutation = useMutation({
  mutationFn: (data) => adminRepo.createUser(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['admin', 'users'])
    setShowModal(false)
  }
})
```

### Repository Pattern
```jsx
// Domain Interface
export class UserRepository {
  async getUsers() { throw new Error('Not implemented') }
  async createUser(data) { throw new Error('Not implemented') }
}

// Infrastructure Implementation
export class ApiUserRepository extends UserRepository {
  async getUsers() {
    const response = await api.get('/admin/users')
    return response.data.data.users
  }
}
```

## 🎯 Feature Implementation Guide

### Page Structure Template
```jsx
export const FeatureManagement = () => {
  // 1. State Management
  const [showModal, setShowModal] = useState(false)
  
  // 2. Data Fetching
  const { data, isLoading, error } = useQuery({...})
  
  // 3. Mutations
  const createMutation = useMutation({...})
  
  // 4. Loading & Error States
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage />
  
  // 5. Main UI
  return (
    <div className="space-y-6">
      {/* Header with Icon */}
      <HeaderSection />
      
      {/* Filters/Search */}
      <FiltersSection />
      
      {/* Data Display */}
      <DataTable />
      
      {/* Modals */}
      {showModal && <Modal />}
    </div>
  )
}
```

### CRUD Operations Template
```jsx
// Create
const createMutation = useMutation({
  mutationFn: (data) => repository.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['feature'])
    setShowCreateModal(false)
  }
})

// Update
const updateMutation = useMutation({
  mutationFn: ({ id, data }) => repository.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries(['feature'])
    setEditingItem(null)
  }
})

// Delete
const deleteMutation = useMutation({
  mutationFn: (id) => repository.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries(['feature'])
    setShowDeleteConfirm(null)
  }
})
```

## 🔒 Authentication & Security

### Auth Flow
```jsx
// Login Process
const { login, loading, error, isAuthenticated, user } = useAuth()

const handleLogin = async (credentials) => {
  const loggedInUser = await login(credentials)
  if (loggedInUser.isAdmin()) {
    navigate('/admin/dashboard', { replace: true })
  }
}

// Protected Routes
<Route path="/admin" element={
  <ProtectedRoute requiredRole="ADMIN">
    <AdminLayout />
  </ProtectedRoute>
}>
```

### Password Change Implementation
```jsx
// Change Password Form
const [passwordForm, setPasswordForm] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changePasswordMutation = useMutation({
  mutationFn: (data) => authRepo.changePassword(data),
  onSuccess: () => {
    // Clear form and show success
  }
})
```

## 🎨 Loading & Error States

### Loading Components
```jsx
// Spinner Component
export const LoadingSpinner = ({ size = 'md', text = 'جاري التحميل...' }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
      {text && <p className="text-[#CFCFCF] mt-2 text-sm">{text}</p>}
    </div>
  </div>
)

// Error Component
export const ErrorMessage = ({ message, onRetry }) => (
  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
    <div className="flex items-center gap-3">
      <AlertTriangle size={20} className="text-red-400" />
      <div>
        <p className="text-red-400 font-medium">حدث خطأ</p>
        <p className="text-[#CFCFCF] text-sm">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="text-brand hover:text-brand-dark text-sm mt-2">
            إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  </div>
)
```

## 🎯 User Roles & Permissions

### Role-Based Access
```jsx
const roles = {
  ADMIN: {
    label: 'مدير',
    permissions: ['all'],
    routes: ['/admin/*']
  },
  SUPERVISOR: {
    label: 'مشرف',
    permissions: ['bus_management', 'student_tracking'],
    routes: ['/supervisor/*']
  },
  PARENT: {
    label: 'ولي أمر',
    permissions: ['view_children', 'request_permissions'],
    routes: ['/parent/*']
  }
}
```

## 📊 Data Models

### User Entity
```javascript
export class User {
  constructor({ id, name, email, role, username, nationalId, createdAt }) {
    this.id = id
    this.name = name
    this.email = email
    this.role = role
    this.username = username
    this.nationalId = nationalId
    this.createdAt = createdAt
  }

  isAdmin() { return this.role === 'ADMIN' }
  isSupervisor() { return this.role === 'SUPERVISOR' }
  isParent() { return this.role === 'PARENT' }
}
```

## 🚀 Performance Optimizations

### Code Splitting
```jsx
// Lazy loading
const AdminDashboard = lazy(() => import('./presentation/pages/admin/AdminDashboard.jsx'))

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

### Query Optimizations
```jsx
// Prefetching
queryClient.prefetchQuery(['admin', 'users'], () => adminRepo.getUsers())

// Stale time configuration
const { data } = useQuery({
  queryKey: ['admin', 'users'],
  queryFn: () => adminRepo.getUsers(),
  staleTime: 5 * 60 * 1000 // 5 minutes
})
```

## 📋 Development Workflow

### File Naming Convention
```
PascalCase: Components (UserManagement.jsx)
camelCase: Functions, variables (handleSubmit)
kebab-case: File directories (admin-routes)
UPPER_CASE: Constants (API_BASE_URL)
```

### Commit Message Format
```
feat: add user management page
fix: resolve RTL layout issue in sidebar
style: update button hover effects
refactor: extract common table component
docs: update API documentation
```

### Code Review Checklist
- [ ] RTL layout properly implemented
- [ ] Arabic text used throughout
- [ ] Lucide icons instead of emojis
- [ ] Loading and error states handled
- [ ] Responsive design tested
- [ ] Accessibility considerations
- [ ] Performance optimizations applied

## 🔧 Environment Configuration

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_APP_NAME=Smart Bus Management
VITE_APP_VERSION=1.0.0
```

### Backend Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/smartbus
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
```

## 📱 PWA Configuration

### Manifest Settings
```json
{
  "name": "نظام الحافلات الذكية",
  "short_name": "الحافلات الذكية",
  "description": "نظام إدارة الحافلات المدرسية",
  "theme_color": "#C12B2B",
  "background_color": "#0B0B0B",
  "display": "standalone",
  "orientation": "portrait",
  "dir": "rtl",
  "lang": "ar"
}
```

## 🎯 Quality Assurance

### Testing Checklist
- [ ] All forms validate correctly
- [ ] Error messages display in Arabic
- [ ] Loading states show during operations
- [ ] Success feedback appears after actions
- [ ] Responsive design works on all devices
- [ ] RTL layout displays correctly
- [ ] Navigation flows work properly
- [ ] Data persistence functions correctly

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Support & Maintenance

### Common Issues & Solutions
1. **RTL Layout Problems**: Ensure `flex-row-reverse` is used for sidebars
2. **Icon Inconsistencies**: Always use Lucide React components
3. **Arabic Text**: Verify all user-facing text is in Arabic
4. **Responsive Issues**: Test on mobile devices and adjust breakpoints
5. **Performance**: Monitor query times and implement pagination

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Static assets optimized
- [ ] PWA manifest updated
- [ ] SSL certificates installed
- [ ] CDN configured for assets

---

**Last Updated:** December 2024
**Document Version:** 1.0
**Maintained By:** Smart Bus Development Team

This document serves as the single source of truth for design and implementation context. Refer to this when maintaining consistency across the application or when context is lost during development sessions.
