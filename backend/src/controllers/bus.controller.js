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
        throw new NotFoundError("You are not assigned to a bus.");
    }
    const location = await busRepository.saveLocation(bus.id, latitude, longitude);

    broadcastLocationUpdate(location);

    return successResponse(res, "Location saved successfully", location, 201);
});

export default {
    saveLocation
}