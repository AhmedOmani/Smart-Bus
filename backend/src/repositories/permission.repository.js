import { client } from "../config/db.js";

const createPermission = async (data) => {
    return client.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM "students" WHERE id = ${data.studentId} FOR UPDATE`;

        const existing = await tx.permission.findFirst({
            where: {
                studentId: data.studentId,
                type: data.type,
                date: data.date,
                status: {not: "REJECTED"}
            }
        });

        if (existing) {
            const err = new Error("Permission already exists for this date");
            err.statusCode = 409;
            err.errorCode = "CONFLICT";
            throw err;
        }

        return tx.permission.create({
            data: {
                studentId: data.studentId,
                type: data.type,
                date: data.date,
                reason: data.reason,
            }
        });
    });
};

const getPermissionById = (id) => client.permission.findUnique({ where: { id } });

const getPermissionsByStudent = (studentId) => client.permission.findMany({ where: { studentId }, orderBy: { date: "desc" } });

const getPendingPermissionsForSupervisor = (supervisorId) =>
    client.permission.findMany({
      where: { status: "PENDING", student: { bus: { supervisorId } } },
      orderBy: { date: "asc" }
    });

const updatePermissionStatus = (id, status) =>
    client.permission.update({
          where: { id },
          data: { status }
    });

export default {
    createPermission,
    getPermissionById,
    getPermissionsByStudent,
    getPendingPermissionsForSupervisor,
    updatePermissionStatus
}