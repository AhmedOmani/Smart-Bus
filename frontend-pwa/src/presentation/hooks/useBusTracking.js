import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiAdminRepository } from '../../infrastructure/repositories/ApiAdminRepository.js'

const buildWsUrl = () => {
  const base = import.meta.env.VITE_API_URL // e.g. http://localhost:3001/api/v1
  const url = new URL(base)
  const proto = url.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${url.host}` // This will be ws://localhost:3001
}

export const useBusTracking = () => {
  const adminRepo = new ApiAdminRepository()
  const queryClient = useQueryClient()
  const [selectedBusId, setSelectedBusId] = useState(null)
  const trailsRef = useRef(new Map()) // busId -> [{lat,lng,timestamp}]
  const wsRef = useRef(null)

  const { data: buses = [], isLoading, error } = useQuery({
    queryKey: ['tracking', 'buses'],
    queryFn: () => adminRepo.getBusesWithLocations(),
    staleTime: 10_000,
    retry: 3,
    onError: (error) => {
      console.error('Failed to fetch buses with locations:', error)
    }
  })

  const trails = useMemo(() => trailsRef.current, [buses])

  useEffect(() => {
    if (wsRef.current) return
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No token found for WebSocket connection')
      return
    }
    
    const wsUrl = `${buildWsUrl()}?token=${encodeURIComponent(token)}`
    console.log('🔌 Connecting to WebSocket:', wsUrl)
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.addEventListener('open', () => {
      console.log('✅ WebSocket connected successfully')
      ws.send(JSON.stringify({ type: 'SUBSCRIBE', busId: null })) // admin subscribes to all
    })

    ws.addEventListener('message', (evt) => {
      try {
        const msg = JSON.parse(evt.data)
        console.log('📨 Received WebSocket message:', msg)
        if (msg.type !== 'LOCATION_UPDATE') return
        const { busId, latitude, longitude, timestamp } = msg.payload

        console.log('📍 Processing location update:', { busId, latitude, longitude, timestamp })

        // update query cache in place
        queryClient.setQueryData(['tracking', 'buses'], (old = []) => {
          let found = false
          const next = old.map(b => {
            if (b.id !== busId) return b
            found = true
            const lastLocation = { latitude, longitude, timestamp }
            return { ...b, lastLocation, online: true }
          })
          console.log('🔄 Updated bus data:', found ? 'bus found and updated' : 'bus not found')
          return found ? next : old
        })

        // update trails
        const list = trailsRef.current.get(busId) || []
        list.push({ lat: latitude, lng: longitude, timestamp })
        if (list.length > 20) list.shift()
        trailsRef.current.set(busId, list)
        console.log('🛤️ Updated trail for bus:', busId, 'points:', list.length)
      } catch (error) {
        console.error('❌ Error processing WebSocket message:', error)
      }
    })

    ws.addEventListener('close', () => { 
      console.log('🔌 WebSocket connection closed')
      wsRef.current = null 
    })
    ws.addEventListener('error', (error) => {
      console.error('❌ WebSocket error:', error)
    })

    return () => { 
      try { 
        ws.close() 
      } catch (error) {
        console.error('❌ Error closing WebSocket:', error)
      } 
    }
  }, [queryClient])

  const stats = useMemo(() => {
    const total = buses.length
    const online = buses.filter(b => b.online).length
    const offline = total - online
    return { total, online, offline }
  }, [buses])

  return { buses, trails, isLoading, error, selectedBusId, setSelectedBusId, stats }
}
