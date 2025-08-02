import { client } from "../config/db.js"

const findUsers = (query = {}) => {
    return client.user.findMany({
        where: query,
        include: {
            parent: true,
            supervisor: true,
        }
    });
};

const findUserBySearch = async (where) => {
    return await client.user.findMany({
        where,  
        include: {
            parent: true,
            supervisor: true,
        },
        orderBy: { name: "asc" }
    });
}

const createUser = async({ nationalId, name, email, phone, role, username , password , hashedPassword }) => {
    const transaction = await client.$transaction(async (tx) => {
       
        const user = await tx.user.create({
            data: { nationalId, name, email, phone, role, username, password: hashedPassword }
        });

        if (role === 'PARENT') {
            await tx.parent.create({
                data: { userId: user.id }
            });
        } else if (role === 'SUPERVISOR') {
            await tx.supervisor.create({
                data: { userId: user.id }
            });
        }

        await tx.credential.create({
            data: { userId: user.id, username, password }
        });

        return user;
    });

    return transaction;
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
    findUserBySearch,
    createUser,
    findUserByUsername,
    updateUserLogout,
    updateUserLogin,
    findUserById,
    updateUserPassword,
    updateUser,
    deleteUser
}