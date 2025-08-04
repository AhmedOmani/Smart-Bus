import { client } from "../config/db.js";

const getDashboard = async (id) => {
    return await client.parent.findUnique({
        where: { userId: id },
        include: {
            user: true,
            students: {
                include: {
                    bus: true
                }
            }
        }
    })
}

const getStudents = async (id) => {
    return await client.parent.findUnique({
        where: { userId: id },
        include: {
            students: {
                include: {
                    bus: true
                }
            }
        }
    })
}

const getBusForParent = async (parentId) => {
    const student = await client.student.findFirst({
        where : {parentId: parentId} ,
        select : { busId: true }
    });

    if (!student) return null;

    const bus = await client.bus.findUnique({
        where: { id: student.busId }
    });
    return bus;
}

const updateHomeLocation = async (parentId, homeAddress, homeLatitude, homeLongitude) => {
    return await client.parent.update({
        where: { id: parentId },
        data: {
            homeAddress,
            homeLatitude,
            homeLongitude
        },
        include: {
            user: true
        }
    });
};

const updateFcmToken = async (parentId, fcmToken) => {
    return await client.parent.update({
        where: { id: parentId },
        data: { fcmToken },
        include: {
            user: true
        }
    });
};

const getParentById = async (parentId) => {
    return await client.parent.findUnique({
        where: { id: parentId },
        include: {
            user: true,
            students: {
                include: {
                    bus: true
                }
            }
        }
    });
};

const getParentByUserId = async (userId) => {
    return await client.parent.findUnique({
        where: { userId },
        include: {
            user: true,
            students: {
                include: {
                    bus: true
                }
            }
        }
    });
};

export default { 
    getDashboard, 
    getStudents, 
    getBusForParent, 
    updateHomeLocation, 
    updateFcmToken, 
    getParentById,
    getParentByUserId
};