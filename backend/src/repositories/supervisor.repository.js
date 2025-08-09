import { client } from "../config/db.js";

const updateHomeLocation = async (supervisorId, homeAddress, homeLatitude, homeLongitude) => {
    return await client.supervisor.update({
        where: { id: supervisorId },
        data: {
            homeAddress,
            homeLatitude,
            homeLongitude
        },
        include: {
            user: true,
            bus: {
                include: {
                    students: true
                }
            }
        }
    });
};

const getSupervisorById = async (supervisorId) => {
    return await client.supervisor.findUnique({
        where: { id: supervisorId },
        include: {
            user: true,
            bus: {
                include: {
                    students: true
                }
            }
        }
    });
};

const getSupervisorByUserId = async (userId) => {
    return await client.supervisor.findUnique({
        where: { userId },
        include: {
            user: true,
            bus: {
                include: {
                    students: true
                }
            }
        }
    });
};

const findSupervisors = async () => {
    return await client.supervisor.findMany({
        include: {
            user: true,
            bus: {
                include: {
                    students: true
                }
            }
        }
    });
};

export default {
    updateHomeLocation,
    getSupervisorById,
    getSupervisorByUserId,
    findSupervisors
};