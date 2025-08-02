import { asyncHandler } from "../utils/asyncHandler.util.js";
import busRepository from "../repositories/bus.repository.js";
import { successResponse } from "../utils/response.util.js";
import { NotFoundError } from "../utils/errors.util.js";

const getBus = asyncHandler(async (req, res) => {
    const supervisorId = req.user.id; // Get from authenticated user
    
    const bus = await busRepository.findBusBySupervisorId(supervisorId);
    console.log(bus);
    if (!bus) {
        
        throw new NotFoundError("You are not assigned to a bus.");
    }
    return successResponse(res, { bus }, "Bus fetched successfully");
});

export default { getBus }; 