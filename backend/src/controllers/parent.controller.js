import { asyncHandler } from "../utils/asyncHandler.util.js";
import parentRepository from "../repositories/parent.repository.js";
import { successResponse } from "../utils/response.util.js";
import { NotFoundError } from "../utils/errors.util.js";

const getDashboard = asyncHandler(async (req , res) => {
    const id = req.user.id;
    const parent = await parentRepository.getDashboard(id);
    return successResponse(res , { parent } , "Dashboard fetched successfully");
}); 

const getStudents = asyncHandler(async (req , res) => {
    const id = req.user.id;
    const students = await parentRepository.getStudents(id);
    return successResponse(res , { students } , "Students fetched successfully");
});

const getBus = asyncHandler(async (req , res) => {
    const id = req.user.id ;
    const bus = await parentRepository.getBusForParent(id);                 
    return successResponse(res , { bus } , "Bus fetched successfully");
});

const updateHomeLocation = asyncHandler(async (req, res) => {
    const { homeAddress, homeLatitude, homeLongitude } = req.validatedData.body;
    const id = req.user.id;
    
    const parent = await parentRepository.getParentByUserId(id);
    if (!parent) {
        throw new NotFoundError("Not found this parent");
    }

    const updatedParent = await parentRepository.updateHomeLocation(
        parent.id,
        homeAddress,
        homeLatitude,
        homeLongitude
    );

    return successResponse(res, { parent: updatedParent }, "Home location updated successfully");
});

const updateFcmToken = asyncHandler(async (req, res) => {
    const { fcmToken } = req.validatedData.body;
    const id = req.user.id;
    
    const parent = await parentRepository.getParentByUserId(id);
    if (!parent) {
        throw new NotFoundError("Not found this parent");
    }

    const updatedParent = await parentRepository.updateFcmToken(parent.id, fcmToken);

    return successResponse(res, { parent: updatedParent }, "FCM token updated successfully");
});

const getProfile = asyncHandler(async (req, res) => {
    const id = req.user.id;
    
    const parent = await parentRepository.getParentByUserId(id);
    if (!parent) {
        throw new NotFoundError("Not found this parent");
    }

    return successResponse(res, { parent }, "Parent profile retrieved successfully");
});

export default { 
    getDashboard, 
    getStudents, 
    getBus,
    updateHomeLocation,
    updateFcmToken,
    getProfile
};