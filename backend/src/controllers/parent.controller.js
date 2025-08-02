import { asyncHandler } from "../utils/asyncHandler.util.js";
import parentRepository from "../repositories/parent.repository.js";
import { successResponse } from "../utils/response.util.js";

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

export default { getDashboard , getStudents , getBus };