import { asyncHandler } from "../utils/asyncHandler.util.js";
import { successResponse } from "../utils/response.util.js";
import busRepository from "../repositories/bus.repository.js";
import { NotFoundError } from "../utils/errors.util.js";
import { broadcastLocationUpdate } from "../services/websocket.service.js";

const saveLocation = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.validatedData.body;
    const supervisorId = req.user.id;
    const bus = await busRepository.findBusBySupervisorId(supervisorId);
    if (!bus) {
        throw new NotFoundError("You are not assigned to bus.");
    }
    const location = await busRepository.saveLocation(bus.id, latitude, longitude);

    // Create the data structure expected by WebSocket service
    const locationUpdate = {
        busId: bus.id,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toISOString()
    };

    console.log('🚌 Broadcasting location update:', locationUpdate);
    broadcastLocationUpdate(locationUpdate);
    console.log('✅ Location broadcast completed');

    return successResponse(res, location, "Location saved successfully", 201);
});

export default {
    saveLocation
}