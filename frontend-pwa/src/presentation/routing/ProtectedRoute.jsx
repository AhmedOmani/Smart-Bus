import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx'

// Presentation Component - Protected Route
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return children
}
