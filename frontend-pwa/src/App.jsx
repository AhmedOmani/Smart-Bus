import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './presentation/pages/LoginPage.jsx'
import { AdminLayout } from './presentation/components/layout/AdminLayout.jsx'
import { AdminDashboard } from './presentation/pages/admin/AdminDashboard.jsx'
import { UsersManagement } from './presentation/pages/admin/UsersManagement.jsx'
import { StudentsManagement } from './presentation/pages/admin/StudentsManagement.jsx'
import { BusesManagement } from './presentation/pages/admin/BusesManagement.jsx'
import { ReportsManagement } from './presentation/pages/admin/ReportsManagement.jsx'
import { CredentialsManagement } from './presentation/pages/admin/CredentialsManagement.jsx'
import { SettingsManagement } from './presentation/pages/admin/SettingsManagement.jsx'
import { BusTracking } from './presentation/pages/admin/BusTracking.jsx'
import { ProtectedRoute } from './presentation/routing/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="buses" element={<BusesManagement />} />
        <Route path="students" element={<StudentsManagement />} />
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="credentials" element={<CredentialsManagement />} />
        <Route path="settings" element={<SettingsManagement />} />
        <Route path="tracking" element={<BusTracking />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App