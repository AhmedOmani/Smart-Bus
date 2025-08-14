import { useMemo, useState, useCallback } from 'react'
import { GoogleMap, Marker, InfoWindow, MarkerClustererF, Polyline, useJsApiLoader } from '@react-google-maps/api'
import { Bus, Navigation } from 'lucide-react'

const containerStyle = { width: '100%', height: '100%' }
const defaultCenter = { lat: 23.588, lng: 58.3829 } // Muscat

const statusColor = (status) => {
  switch (status) {
    case 'ACTIVE': return '#22c55e'
    case 'MAINTENANCE': return '#f59e0b'
    default: return '#9ca3af'
  }
}

const BusMarker = ({ bus, onClick, isSelected }) => {
  const [showInfo, setShowInfo] = useState(false)
  
  if (!bus.lastLocation) return null

  const position = {
    lat: bus.lastLocation.latitude,
    lng: bus.lastLocation.longitude
  }

  const icon = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${statusColor(bus.status)}" stroke="white" stroke-width="2"/>
        <path d="M8 12h16v8H8z" fill="white"/>
        <circle cx="12" cy="16" r="2" fill="${statusColor(bus.status)}"/>
        <circle cx="20" cy="16" r="2" fill="${statusColor(bus.status)}"/>
        <rect x="10" y="10" width="12" height="2" fill="white"/>
      </svg>
    `)}`,
    scaledSize: { width: 32, height: 32 },
    anchor: { x: 16, y: 16 }
  }

  return (
    <>
      <Marker
        position={position}
        icon={icon}
        onClick={() => {
          onClick(bus.id)
          setShowInfo(true)
        }}
        zIndex={isSelected ? 1000 : 1}
      />
      {showInfo && (
        <InfoWindow
          position={position}
          onCloseClick={() => setShowInfo(false)}
        >
          <div className="p-2 min-w-[200px]">
            <h3 className="font-bold text-gray-900 mb-2">{bus.busNumber}</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">الحالة:</span> {bus.status === 'ACTIVE' ? 'نشط' : bus.status === 'MAINTENANCE' ? 'صيانة' : 'غير نشط'}</p>
              {bus.supervisor?.user?.name && (
                <p><span className="font-medium">المشرف:</span> {bus.supervisor.user.name}</p>
              )}
              <p><span className="font-medium">الحالة:</span> 
                <span className={`ml-1 ${bus.online ? 'text-green-600' : 'text-red-600'}`}>
                  {bus.online ? 'أونلاين' : 'أوفلاين'}
                </span>
              </p>
              {bus.lastLocation && (
                <p className="text-xs text-gray-500">
                  آخر تحديث: {new Date(bus.lastLocation.timestamp).toLocaleTimeString('ar-SA')}
                </p>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  )
}

export const TrackingMap = ({ buses, trails, selectedBusId, onSelect, className = '' }) => {
  const [map, setMap] = useState(null)
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })

  const onLoad = useCallback((map) => {
    map.setOptions({ 
      mapTypeControl: false, 
      streetViewControl: false,
      fullscreenControl: false
    })
    setMap(map)
  }, [])

  const center = useMemo(() => {
    if (selectedBusId) {
      const selectedBus = buses.find(b => b.id === selectedBusId)
      if (selectedBus?.lastLocation) {
        return {
          lat: selectedBus.lastLocation.latitude,
          lng: selectedBus.lastLocation.longitude
        }
      }
    }
    return defaultCenter
  }, [selectedBusId, buses])

  const selectedBusTrail = useMemo(() => {
    if (!selectedBusId) return []
    const trail = trails.get(selectedBusId) || []
    return trail.map(point => ({ lat: point.lat, lng: point.lng }))
  }, [selectedBusId, trails])

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-red-500/10 border border-red-500/20 rounded-xl">
        <div className="text-center">
          <p className="text-red-400 mb-2">خطأ في تحميل الخريطة</p>
          <p className="text-sm text-gray-400">تأكد من إعدادات Google Maps API</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-500/10 border border-gray-500/20 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-2"></div>
          <p className="text-gray-400">جاري تحميل الخريطة...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full h-full rounded-xl overflow-hidden border border-[#262626] ${className}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={selectedBusId ? 15 : 12}
        onLoad={onLoad}
        options={{
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {/* Bus Markers */}
        {buses.map((bus) => (
          <BusMarker
            key={bus.id}
            bus={bus}
            onClick={onSelect}
            isSelected={bus.id === selectedBusId}
          />
        ))}

        {/* Selected Bus Trail */}
        {selectedBusTrail.length > 1 && (
          <Polyline
            path={selectedBusTrail}
            options={{
              strokeColor: '#3b82f6',
              strokeOpacity: 0.8,
              strokeWeight: 3,
              geodesic: true
            }}
          />
        )}
      </GoogleMap>
    </div>
  )
}
