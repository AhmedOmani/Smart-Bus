import { useState, useMemo } from 'react'
import { Search, Filter, Bus, Wifi, WifiOff, MapPin } from 'lucide-react'

export const BusSidebar = ({ 
  buses, 
  selectedBusId, 
  onSelectBus, 
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [onlineFilter, setOnlineFilter] = useState('ALL')

  const filteredBuses = useMemo(() => {
    return buses.filter(bus => {
      const matchesSearch = bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (bus.supervisor?.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'ALL' || bus.status === statusFilter
      const matchesOnline = onlineFilter === 'ALL' || 
                           (onlineFilter === 'ONLINE' && bus.online) ||
                           (onlineFilter === 'OFFLINE' && !bus.online)
      
      return matchesSearch && matchesStatus && matchesOnline
    })
  }, [buses, searchTerm, statusFilter, onlineFilter])

  const stats = useMemo(() => {
    const total = buses.length
    const online = buses.filter(b => b.online).length
    const offline = total - online
    const active = buses.filter(b => b.status === 'ACTIVE').length
    const maintenance = buses.filter(b => b.status === 'MAINTENANCE').length
    const inactive = buses.filter(b => b.status === 'INACTIVE').length
    
    return { total, online, offline, active, maintenance, inactive }
  }, [buses])

  return (
    <div className={`w-80 bg-[#141414] border-l border-[#262626] flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-[#262626]">
        <h2 className="text-lg font-bold text-white mb-2">تتبع الحافلات</h2>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-[#0B0B0B] rounded-lg p-2">
            <div className="flex items-center gap-1 text-green-400">
              <Wifi size={14} />
              <span>{stats.online}</span>
            </div>
            <span className="text-[#CFCFCF] text-xs">أونلاين</span>
          </div>
          <div className="bg-[#0B0B0B] rounded-lg p-2">
            <div className="flex items-center gap-1 text-red-400">
              <WifiOff size={14} />
              <span>{stats.offline}</span>
            </div>
            <span className="text-[#CFCFCF] text-xs">أوفلاين</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-[#262626] space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            placeholder="البحث عن حافلة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 bg-[#0B0B0B] border border-[#262626] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الحالة</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="ALL">جميع الحافلات ({stats.total})</option>
            <option value="ACTIVE">نشط ({stats.active})</option>
            <option value="MAINTENANCE">صيانة ({stats.maintenance})</option>
            <option value="INACTIVE">غير نشط ({stats.inactive})</option>
          </select>
        </div>

        {/* Online Filter */}
        <div>
          <label className="block text-sm font-medium text-[#CFCFCF] mb-2">الاتصال</label>
          <select
            value={onlineFilter}
            onChange={(e) => setOnlineFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0B0B0B] border border-[#262626] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="ALL">الكل</option>
            <option value="ONLINE">أونلاين فقط</option>
            <option value="OFFLINE">أوفلاين فقط</option>
          </select>
        </div>
      </div>

      {/* Bus List */}
      <div className="flex-1 overflow-y-auto">
        {filteredBuses.length === 0 ? (
          <div className="p-4 text-center">
            <Bus size={48} className="mx-auto text-[#666] mb-2" />
            <p className="text-[#CFCFCF]">لا توجد حافلات</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredBuses.map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                isSelected={bus.id === selectedBusId}
                onClick={() => onSelectBus(bus.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const BusCard = ({ bus, isSelected, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400'
      case 'MAINTENANCE': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return 'نشط'
      case 'MAINTENANCE': return 'صيانة'
      default: return 'غير نشط'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-brand/20 border border-brand/30' 
          : 'bg-[#0B0B0B] border border-[#262626] hover:border-brand/30'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-white">{bus.busNumber}</h3>
        <div className="flex items-center gap-1">
          {bus.online ? (
            <Wifi size={14} className="text-green-400" />
          ) : (
            <WifiOff size={14} className="text-red-400" />
          )}
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <p className={`${getStatusColor(bus.status)}`}>
          {getStatusText(bus.status)}
        </p>
        
        {bus.supervisor?.user?.name && (
          <p className="text-[#CFCFCF]">
            {bus.supervisor.user.name}
          </p>
        )}

        {bus.lastLocation ? (
          <div className="flex items-center gap-1 text-xs text-[#666]">
            <MapPin size={12} />
            <span>
              {new Date(bus.lastLocation.timestamp).toLocaleTimeString('ar-SA', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        ) : (
          <p className="text-xs text-red-400">لا توجد بيانات موقع</p>
        )}
      </div>
    </div>
  )
}
