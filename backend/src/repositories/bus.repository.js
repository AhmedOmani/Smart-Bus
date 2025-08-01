import { client } from "../config/db.js";

const findBuses = () => {
    return client.bus.findMany({
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

const findBusById = (id) => {
    return client.bus.findUnique({ where: { id } });
};

const findBusBySupervisorId = (supervisorId) => {
    return client.bus.findUnique({ where: { supervisorId } });
};

const createBus = (data) => {
    const { supervisorId, ...busData } = data;
    const payload = {
        ...busData,
        ...(supervisorId && { supervisor: { connect: { userId: supervisorId } } }),
    };
    return client.bus.create({ data: payload });
};

const updateBus = (id, data) => {
    const { supervisorId, ...busData } = data;
    const payload = {
        ...busData,
    };

    if (supervisorId !== undefined) {
        payload.supervisor = supervisorId
            ? { connect: { userId: supervisorId } }
            : { disconnect: true };
    }

    return client.bus.update({ where: { id }, data: payload });
};

const deleteBus = (id) => {
    return client.bus.delete({ where: { id } });
};

const saveLocation = (busId, latitude, longitude) => {
    return client.locationLog.create({
        data: { busId, latitude, longitude }
    });
};

export default {
    findBuses,
    findBusById,
    findBusBySupervisorId,
    createBus,
    updateBus,
    deleteBus,
    saveLocation
};