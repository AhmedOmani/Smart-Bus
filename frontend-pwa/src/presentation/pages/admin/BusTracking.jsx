import { useBusTracking } from '../../hooks/useBusTracking.js'
import { TrackingMap } from '../../components/tracking/TrackingMap.jsx'
import { BusSidebar } from '../../components/tracking/BusSidebar.jsx'
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { MapPin, Navigation } from 'lucide-react'

export const BusTracking = () => {
  const { 
    buses, 
    trails, 
    isLoading, 
    error, 
    selectedBusId, 
    setSelectedBusId, 
    stats 
  } = useBusTracking()

  // Debug logging
  console.log('BusTracking render:', { 
    busesCount: buses.length, 
    isLoading, 
    error: error?.message,
    stats 
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <ErrorMessage message={error.message} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">تتبع الحافلات</h1>
          <p className="text-[#CFCFCF] mt-1">مراقبة مواقع الحافلات في الوقت الفعلي</p>
        </div>
        
        {/* Live Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg">
            <MapPin size={16} className="text-green-400" />
            <span className="text-sm text-white">
              {stats.online} أونلاين
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg">
            <Navigation size={16} className="text-blue-400" />
            <span className="text-sm text-white">
              {stats.total} إجمالي
            </span>
          </div>
        </div>
      </div>

      {/* Map and Sidebar Container */}
      <div className="flex h-[calc(100vh-280px)] gap-4">
        {/* Map */}
        <div className="flex-1">
          <TrackingMap
            buses={buses}
            trails={trails}
            selectedBusId={selectedBusId}
            onSelect={setSelectedBusId}
          />
        </div>

        {/* Sidebar */}
        <BusSidebar
          buses={buses}
          selectedBusId={selectedBusId}
          onSelectBus={setSelectedBusId}
        />
      </div>

      {/* Instructions */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-4">
        <h3 className="text-sm font-medium text-white mb-2">تعليمات الاستخدام:</h3>
        <ul className="text-xs text-[#CFCFCF] space-y-1">
          <li>• انقر على أي حافلة في القائمة لرؤية موقعها على الخريطة</li>
          <li>• انقر على أي علامة على الخريطة لرؤية تفاصيل الحافلة</li>
          <li>• استخدم الفلاتر للبحث عن حافلات محددة</li>
          <li>• الحافلات الأونلاين تظهر بعلامة خضراء، والأوفلاين بعلامة حمراء</li>
        </ul>
      </div>
    </div>
  )
}
