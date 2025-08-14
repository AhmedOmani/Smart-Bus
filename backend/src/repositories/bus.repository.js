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
        },
        orderBy: [
            { createdAt: 'asc' },
            { busNumber: 'asc' }
        ]
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

//Find the latest location log for each bus
const findBusesWithLocation = async () => {
    const buses = await client.bus.findMany({
        include: {
            supervisor: { 
                include: {
                    user: true
                }
            },
            locationLogs: {
                orderBy: { timestamp: "desc" },
                take: 1
            }
        },
        orderBy: [{ createdAt: "asc" } , { busNumber: "asc"}]
    });

    return buses.map(bus => {
        const last = bus.locationLogs[0] || null;
        return {
            id: bus.id,
            busNumber: bus.busNumber,
            status: bus.status,
            supervisor: bus.supervisor ? {
                user: {
                    id: bus.supervisor.user.id,
                    name: bus.supervisor.user.name,
                    email: bus.supervisor.user.email
                }
            } : null,
            lastLocation: last ? {
                latitude: last.latitude,
                longitude: last.longitude,
                timestamp: last.timestamp
            } : null
        };
    });
};

export default {
    findBuses,
    findBusById,
    findBusBySupervisorId,
    createBus,
    updateBus,
    deleteBus,
    saveLocation,
    findBusesWithLocation
};