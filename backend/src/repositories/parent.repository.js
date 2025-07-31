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

export default { getDashboard , getStudents };