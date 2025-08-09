import { useQuery } from '@tanstack/react-query'
import { AdminService } from '../../application/services/AdminService.js'

// Presentation Hook - Admin Dashboard
export const useAdminDashboard = () => {
  const adminService = new AdminService()

  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  })
}
