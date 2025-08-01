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

export default { getDashboard , getStudents , getBusForParent };