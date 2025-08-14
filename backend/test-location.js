import axios from 'axios'

const API_BASE = 'http://localhost:3001/api/v1'

// Test supervisor credentials (replace with actual supervisor credentials)
const SUPERVISOR_CREDENTIALS = {
  username: 'reham', 
  password: '(CjO<b4e'    
}

async function testLocationPosting() {
  try {
    // 1. Login as supervisor
    console.log('🔐 Logging in as supervisor...')
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, SUPERVISOR_CREDENTIALS)
    const token = loginResponse.data.data.token
    console.log('✅ Login successful')

    // 2. Post location (simulating bus movement)
    const locations = [
      { lat: 23.588, lng: 58.3829 }, // Muscat center
      { lat: 23.590, lng: 58.3850 }, // Slightly north
      { lat: 23.585, lng: 58.3800 }, // Slightly south
      { lat: 23.592, lng: 58.3880 }, // Further north
    ]
    while(true){
        for (let i = 0; i < locations.length; i++) {
      const location = locations[i]
      console.log(`📍 Posting location ${i + 1}:`, location)
      
      await axios.post(`${API_BASE}/bus/location`, {
        latitude: location.lat,
        longitude: location.lng
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log(`✅ Location ${i + 1} posted successfully`)
      
      // Wait 2 seconds between posts
      if (i < locations.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
        }
    }
    console.log('🎉 All test locations posted!')
    console.log('📱 Now check the admin tracking page to see the bus moving!')

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message)
    
    if (error.response?.status === 404) {
      console.log('💡 Tip: Make sure the supervisor is assigned to a bus')
    }
    if (error.response?.status === 401) {
      console.log('💡 Tip: Check supervisor credentials')
    }
  }
}

// Run the test
testLocationPosting()
