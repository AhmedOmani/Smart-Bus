import { asyncHandler } from "../utils/asyncHandler.util.js";
import busRepository from "../repositories/bus.repository.js";
import supervisorRepository from "../repositories/supervisor.repository.js";
import { successResponse } from "../utils/response.util.js";
import { NotFoundError } from "../utils/errors.util.js";

const getBus = asyncHandler(async (req, res) => {
    const supervisorId = req.user.id; // Get from authenticated user
    
    const bus = await busRepository.findBusBySupervisorId(supervisorId);
  
    if (!bus) {
        throw new NotFoundError("You are not assigned to a bus.");
    }
    return successResponse(res, { bus }, "Bus fetched successfully");
});

const updateHomeLocation = asyncHandler(async (req, res) => {
    const { homeAddress, homeLatitude, homeLongitude } = req.validatedData.body;
    const id = req.user.id;
    
    const supervisor = await supervisorRepository.getSupervisorByUserId(id);
    if (!supervisor) {
        throw new NotFoundError("Supervisor");
    }

    const updatedSupervisor = await supervisorRepository.updateHomeLocation(
        supervisor.id,
        homeAddress,
        homeLatitude,
        homeLongitude
    );

    return successResponse(res, { supervisor: updatedSupervisor }, "Home location updated successfully");
});

const getProfile = asyncHandler(async (req, res) => {
    const id = req.user.id;
    
    const supervisor = await supervisorRepository.getSupervisorByUserId(id);
    if (!supervisor) {
        throw new NotFoundError("Supervisor");
    }

    return successResponse(res, { supervisor }, "Supervisor profile retrieved successfully");
});

export default { 
    getBus,
    updateHomeLocation,
    getProfile
}; 