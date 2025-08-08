import { client } from "../config/db.js";

const findStudents = async (query = {}) => {
    return await client.student.findMany({
        where: query,
        include: {
            parent: {
                include: {
                    user: true
                }
            },
            bus: true
        }
    });
};

const findStudentById = async (id) => {
    return await client.student.findUnique({
        where: { id },
    });
};

const findStudentByParentId = async (studentId , parentId) =>  {
    return await client.student.findFirst({
        where: {
            id: studentId,
            parentId: parentId
        }
    })
}

const findBusByStudentId = async (studentId) => {
    return await client.student.findUnique({
        where: { id: studentId },
        select: {
            busId: true
        }
    })
}

const createStudent = async (data) => {
    const { busId, ...studentData } = data;
    return await client.student.create({
        data: {
          ...studentData,
          busId, 
        },
    });
};

const updateStudent = async (id, data) => {
    const { busId, parentId, ...studentData } = data;
    const payload = {
        ...studentData,
    };

    if (busId !== undefined) {
        payload.bus = busId
            ? { connect: { id: busId } }
            : { disconnect: true };
    }

    if (parentId !== undefined) {
        payload.parent = parentId ? { connect: { userId: parentId } } : {disconnect: true};
    }

    return await client.student.update({
        where: { id },
        data: payload,
    });
};

const deleteStudent = async (id) => {
    return await client.student.delete({
        where: { id },
    });
};  


export default {
    findStudents,
    findStudentById,
    findStudentByParentId,
    findBusByStudentId,
    createStudent,
    updateStudent,
    deleteStudent,
};