import { client} from "../config/db.js";

const createAbsence = async (data) => {
    return await client.absence.create({
        data: {
            studentId: data.studentId,
            reportedBy: data.reportedBy,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason,
            type: data.type,
        },
        include: {
            student: {
                include: {
                    parent: {
                        include: {user: true}
                    },
                    bus: true
                }
            }
        }
    });
}

const getAbsenceById = async (id) => {
    return await client.absence.findUnique({
        where: {id},
        include: {
            student: {
                include: {
                    parent: {
                        include: {user: true}
                    },
                    bus: true
                }
            }
        }
    });
}

const getAbsencesByStudent = async (studentId) => {
    return await client.absence.findMany({
        where: {studentId},
        orderBy: {startDate: "desc"}
    });
}

const getPendingAbsences = async (supervisorId) => {
    return await client.absence.findMany({
        where: {
            status: "PENDING",
            student: {
                bus: {supervisorId: supervisorId}
            }
        },
        include: {
            student: {
                include: {
                    parent: {
                        include: {user: true},
                    },
                    bus: true
                }
            }
        },
        orderBy: {reportedAt: "desc"}
    });
}

const updateAbsenceStatus = async (id , approvedBy , status, notes) => {
    return await client.absence.update({
        where: {id},
        data: {
            status,
            approvedBy,
            approvedAt: new Date(),
            notes
        }
    })
}

const deleteAbsence = async (id) => {
    return await client.absence.delete({
        where: {id}
    });
}

export default {
    createAbsence,
    getAbsenceById,
    getAbsencesByStudent,
    getPendingAbsences,
    updateAbsenceStatus,
    deleteAbsence
}