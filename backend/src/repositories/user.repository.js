import { client } from "../config/db.js"

const findUsers = async () => {
    return await client.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            username: true,
            status: true,
            createdAt: true,
            students: { select: { id: true, name: true } },
            buses: { select: { id: true, name: true } }
        },
        orderBy: { name: "asc" }
    });
}

const createUser = async({ name, email, phone, role, username , password }) => {
    return await client.user.create({
        data: { name, email, phone, role, username, password }
    });
}

const createUserWithCredentials = async({ name, email, phone, role }, { username, password: plainPassword, hashedPassword }) => {
    return await client.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: { name, email, phone, role, username, password: hashedPassword }
        });

        await tx.credential.create({
            data: { userId: user.id, username, password: plainPassword }
        });

        return user;
    });
}           

const findUserByUsername = async(username) => {
    return await client.user.findUnique({
        where: { username }
    });
}

const findUserById = async(id) => {
    return await client.user.findUnique({
        where: {id}
    });
} 

const updateUserLogout = async (id , token) => {
    await client.$transaction(async (tx) => { 
        await tx.blackListedToken.create({
            data: {
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });

        if (id) {
            await tx.user.update({
                where: {id} ,
                data: { lastLogoutAt: new Date()}
            });
        }
    });
}

const updateUserLogin = async (id , data) => {
    return await client.user.update({
        where: {id},
        data
    });
}

const updateUserPassword = async (id , password) => {
    return await client.user.update({
        where: {id},
        data: {password} 
    });
}   

const updateUser = async (id , data) => {
    return await client.user.update({
        where: {id} ,
        data
    });
}

const deleteUser = async (id) => {
    return await client.user.delete({
        where: {id}
    })
}

export default {
    findUsers,
    createUserWithCredentials,
    createUser,
    findUserByUsername,
    updateUserLogout,
    updateUserLogin,
    findUserById,
    updateUserPassword,
    updateUser,
    deleteUser
}