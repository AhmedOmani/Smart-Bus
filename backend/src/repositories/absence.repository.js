import { client } from "../config/db.js";

/*
   - WE DONT CREATE ABSENCE DIRECTLY, WE MAKE SURE THAT THERE IS NO OVERLAPPING ABSENCE BEFORE CREATING IT
   - WHAT DOES THIS MEAN?
   - Two absence records for the same student whose date ranges intersect. Formally, ranges [startA, endA] and [startB, endB] overlap if startA ≤ endB and startB ≤ endA.
   - Example 1 (identical):
        Absence A: 2025-09-10 → 2025-09-12
        Absence B: 2025-09-10 → 2025-09-12
        Overlap: full range (duplicate)

   - Example 2 (partial overlap):
        Absence A: 2025-09-10 → 2025-09-12
        Absence B: 2025-09-11 → 2025-09-13
        Overlap: 2025-09-11 → 2025-09-12

   - Example 3 (edge-day overlap):
        Absence A: 2025-09-10 → 2025-09-10
        Absence B: 2025-09-10 → 2025-09-11
        Overlap: 2025-09-10

    - SO WE NEED TO CHECK FOR OVERLAPPING ABSENCES BEFORE CREATING A NEW ONE, WHICH WHAT WE ARE DOING.

    - ANOTHER QUESTION WHY WE USER "FOR UPDATE" IN ROW QUERY ?
    - ANSWER:
        - What happens with two concurrent requests for the same student and dates:
            - Request A acquires the student row lock first, finds no overlapping record, inserts, commits.
            - Request B is blocked on the row lock. After A commits, B acquires the lock, runs the overlap query, now finds A’s record, and throws 409 instead of inserting a duplicate.
        - Why the lock matters:
            - Without the row lock, both A and B could check “no overlap” at the same time and both insert, producing duplicates (classic race condition). The lock serializes them.
*/
const createAbsenceInternal = async (data , transaction) => {
    return transaction.absence.create({
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
              parent: { include: { user: true } },
              bus: true,
            },
          },
        },
    });
};
const findOverlappingAbsence = async (transaction , studentId , startDate, endDate) => {
    return transaction.absence.findFirst({
        where : {
            studentId,
            status: {not: "REJECTED"},
            startDate: {lte: endDate},
            endDate: {gte: startDate}
        }
    });
};
const createAbsence = async (data) => {
    return client.$transaction(async (tx) => {
        //Serialize requests per student to avoid race conditions
        await tx.$queryRaw`SELECT id FROM "students" WHERE id =${data.studentId} FOR UPDATE`;

        const overlapping = await findOverlappingAbsence(tx , data.studentId , data.startDate , data.endDate);
        if (overlapping) {
            const err = new Error("Overlapping issue! absence already exists for this period");
            err.statusCode = 409;
            err.errorCode = "CONFLICT";
            throw err;
        }
        return createAbsenceInternal(data, tx);
    });
};

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
};
const getAbsencesByStudent = async (studentId) => {
    return await client.absence.findMany({
        where: {studentId},
        orderBy: {startDate: "desc"}
    });
};

const getPendingAbsencesForSupervisor = async (supervisorId) => {
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
};

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
};

const deleteAbsence = async (id) => {
    return await client.absence.delete({
        where: {id}
    });
};

const findAbsencesForAdmin = async (filters = {}) => {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.busId) where.student = { busId: filters.busId };

    // Overlap any portion of [startDate, endDate]
    if (filters.startDate || filters.endDate) {
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;
        where.AND = where.AND || [];
        if (end) where.AND.push({ startDate: { lte: end } });
        if (start) where.AND.push({ endDate: { gte: start } });
    }

    return client.absence.findMany({
        where,
        orderBy: { reportedAt: "desc" },
        include: {
            student: { include: { parent: { include: { user: true } }, bus: true } }
        }
    });
};

export default {
    createAbsence,
    getAbsenceById,
    getAbsencesByStudent,
    getPendingAbsencesForSupervisor,
    updateAbsenceStatus,
    deleteAbsence,
    findAbsencesForAdmin
}