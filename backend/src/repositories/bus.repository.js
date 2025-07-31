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

const createBus = (data) => {
    const { supervisorId, ...busData } = data;
    const payload = {
        ...busData,
        ...(supervisorId && { supervisor: { connect: { id: supervisorId } } }),
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
            ? { connect: { id: supervisorId } }
            : { disconnect: true };
    }

    return client.bus.update({ where: { id }, data: payload });
};

const deleteBus = (id) => {
    return client.bus.delete({ where: { id } });
};

export default {
    findBuses,
    findBusById,
    createBus,
    updateBus,
    deleteBus,
};