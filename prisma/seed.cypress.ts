import { PrismaClient } from '@prisma/client';
import { User } from "@prisma/client";
import { 
    movementPatterns as movementPatternData,
    userRoles as userRoleData,
    user as userData, 
    admin as adminData,
    exercises as exerciseData 
} from './seed.data';
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function reset() {
    await prisma.exercise.deleteMany();
    await prisma.movementPattern.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.userRole.deleteMany();
}

async function seedUserRoles() {
    const userRoles = await prisma.$transaction(
        userRoleData.map(data => 
            prisma.userRole.upsert({
                where: { role: data.role},
                update: {},
                create: { role: data.role}
            })
        )
    )
    console.log(userRoles);
}

async function seedMovementPatterns() {
    const movementPatterns = await prisma.$transaction(
        movementPatternData.map(data => 
            prisma.movementPattern.upsert({
                where: { id: data.id },
                update: { name: data.name },
                create: {
                    id: data.id,
                    name: data.name
                }
            })
        )
    );
    console.log(movementPatterns);
}

async function seedAdminUser() {
    const admin = await prisma.user.upsert({
        where: { email: adminData.email },
        update: {
            name: adminData.name,
            email: adminData.email,
            password: await hash(adminData.password, 10),
            role: adminData.role
        },
        create: {
            name: adminData.name,
            email: adminData.email,
            password: await hash(adminData.password, 10),
            role: adminData.role
        }
    })
    console.log(admin);

    if (admin) {
        const provider = "credentials";
        const adminAccount = await prisma.account.upsert({
            where: {
                provider_providerAccountId: {
                    provider: provider,
                    providerAccountId: admin.id
                }
            },
            update: {
                type: provider,
                provider: provider,
                providerAccountId: admin.id,
            },
            create: {
              userId: admin.id,
              type: provider,
              provider: provider,
              providerAccountId: admin.id,
            },
        })
        console.log(adminAccount);
    }

    
    return admin;
}

async function seedUser() {
    const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
            name: userData.name,
            email: userData.email,
            password: await hash(userData.password, 10),
            role: userData.role
        },
        create: {
            name: userData.name,
            email: userData.email,
            password: await hash(userData.password, 10),
            role: userData.role
        }
    })
    console.log(user);

    if (user) {
        const provider = "credentials";
        const userAccount = await prisma.account.upsert({
            where: {
                provider_providerAccountId: {
                    provider: provider,
                    providerAccountId: user.id
                }
            },
            update: {
                type: provider,
                provider: provider,
                providerAccountId: user.id,
            },
            create: {
              userId: user.id,
              type: provider,
              provider: provider,
              providerAccountId: user.id,
            },
        })
        console.log(userAccount);
    }
    return user;
}

async function seedExercises(admin: User, user: User) {
    const exercises = await prisma.$transaction(
        exerciseData(admin, user).map(data => 
            prisma.exercise.upsert({
                where: { 
                    name: data.name,
                },
                update: {
                    id: data.id,
                    movementPatternId: data.movementPatternId,
                    primaryMuscles: data.primaryMuscles,
                    secondaryMuscles: data.secondaryMuscles,
                    global: data.global,
                    userEmail: data.userEmail,
                },
                create: {
                    id: data.id,
                    name: data.name,
                    movementPatternId: data.movementPatternId,
                    primaryMuscles: data.primaryMuscles,
                    secondaryMuscles: data.secondaryMuscles,
                    global: data.global,
                    userEmail: data.userEmail,
                }
            })
        )
    )
    console.log(exercises);
    return exercises;
}

async function main() {
    await reset();
    await seedUserRoles();
    await seedMovementPatterns();
    const user = await seedUser();
    const admin = await seedAdminUser();
    await seedExercises(admin, user);
}

async function seed(): Promise<string> {
    return new Promise((resolve, reject) => {
        main()
        .then(async() => {
            await prisma.$disconnect();
            resolve('Database successfully seeded.');
        })
        .catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            reject(e);
        })
    }) 
}

export default seed;



    