const mockUsers = {
    admin: {
        id: "f14fcb03-6600-4df5-92d7-ade0492ced79",
        name: "Abeer",
        email: "alahd@gmail.com",
        role: "ADMIN",
        phone: "+968 99177838",
        nationalId: "1234567890",
        username: "abeer",
        password: "admin123",
    },
    supervisor: {
        id: "f14fcb03-6600-4df5-92d7-ade0492ced72",
        name: "Reham" ,
        email: "reham@gmail.com",
        role: "SUPERVISOR",
        nationalId: "4234324243",
        username: "reham",
        phone: "+968 99177848",
        password: "admin123",
    },
    parent: {
        id: "f14fcb03-6600-4df5-92d7-wde0492ced79",
        name: "Ahmed",
        email: "ahmed@gmail.com",
        role: "PARENT",
        phone: "+968 99177838",
        nationalId: "4553554545",
        username: "ahmed",
        password: "admin123",
    },
}

const mockBus = {
    id: "096ce96d-612d-441f-8bd7-e5c78099256",
    busNumber: "Bus 1",
    licensePlate: "ي ي 333",
    capacity: 40,
    supervisorId: "096ce96d-612d-441f-8bd7-e5c78099256",
}

const mockStudent = {
    id : "096ce96d-612d-441f-8bd7-e5c78099256",
    name: "Test Student",
    nationalId: "676577575",
    grade: "Grade 5",
    parentId: "096ce96d-612d-441f-8bd7-e5c78099256",
    busId: "096ce96d-612d-441f-8bd7-e5c78099256",
}

export {
    mockUsers,
    mockBus,
    mockStudent
};