import { client } from "../config/db.js";

const findStudents = (query = {}) => {
    return client.student.findMany({
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

const findStudentById = (id) => {
    return client.student.findUnique({
        where: { id },
    });
};

const createStudent = (data) => {
    return client.student.create({ data });
};

const updateStudent = (id, data) => {
    return client.student.update({
        where: { id },
        data,
    });
};

const deleteStudent = (id) => {
    return client.student.delete({
        where: { id },
    });
};


export default {
    findStudents,
    findStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};