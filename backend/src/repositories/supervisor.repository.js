import { client } from "../config/db.js";

const findSupervisors = async () => {
    return await client.supervisor.findMany({
        include: {
            user: true,
        }
    });
}

const findSupervisorById = async (id) => {
    return await client.supervisor.findUnique({
        where: { id },
        include: {
            user: true,
        }
    });
}

export default { findSupervisors, findSupervisorById };