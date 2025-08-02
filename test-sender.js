const axios = require("axios");

const BASE_URL = "http://localhost:3001/api/v1"
let token ;
let busId ;

const login = async () => {
    const username = "omani";
    const password = ";{2lC,xI";
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            username,
            password
        });
        token = response.data.data.token;
        console.log("Login successful");
    } catch(error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        process.exit(1); // Exit if we can't log in
    }
}

const sendLocation = async (latitude , longitude) => {
    if (!token) {
        console.error('Cannot send location, not authenticated.');
        return;
    }
    console.log(`Sending location: Lat=${latitude.toFixed(4)}, Lng=${longitude.toFixed(4)}`)
    try {
        await axios.post(`${BASE_URL}/bus/location` ,
            {latitude , longitude} ,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        console.log("Location sent successfully");
    } catch(error) {
        console.error('Failed to send location:', error.response ? error.response.data : error.message);
    }
} 

const main = async () => {
    await login();

    let lat = 34.9903;
    let long = -118.2437;

    setInterval(() => {
        lat += 10;
        long += 10;
        sendLocation(lat , long);
    } , 5000);
}

main();