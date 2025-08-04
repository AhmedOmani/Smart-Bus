import { client } from "../config/db.js";

const findBuses = async () => {
    return await client.bus.findMany({
        include: {
            supervisor: {
                include: {
                    user: true
                }
            },
            students: true
        }
    });
};

const findBusById = async (id) => {
    return await client.bus.findUnique({ where: { id } });
};

const findBusBySupervisorId = async (supervisorId) => {
    return await client.bus.findUnique({ where: { supervisorId } });
};

const createBus = async (data) => {
    const { supervisorId, ...busData } = data;
    const payload = {
        ...busData,
        ...(supervisorId && { supervisor: { connect: { userId: supervisorId } } }),
    };
    return await client.bus.create({ data: payload });
};

const updateBus = async (id, data) => {
    const { supervisorId, ...busData } = data;
    const payload = {
        ...busData,
    };

    if (supervisorId !== undefined) {
        payload.supervisor = supervisorId
            ? { connect: { userId: supervisorId } }
            : { disconnect: true };
    }

    return await client.bus.update({ where: { id }, data: payload });
};

const deleteBus = async (id) => {
    return await client.bus.delete({ where: { id } });
};

const saveLocation = async (busId, latitude, longitude) => {
    return await client.locationLog.create({
        data: { busId, latitude, longitude }
    });
};

const findBusOfSupervisorId = async (busId ,supervisorId) => {
    return await client.bus.findFirst({
        where: {
            id: busId,
            supervisorId: supervisorId
        }
    })
}

export default {
    findBuses,
    findBusById,
    findBusBySupervisorId,
    createBus,
    updateBus,
    deleteBus,
    saveLocation
};