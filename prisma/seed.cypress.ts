import { PrismaClient } from '@prisma/client';
import { User } from "@prisma/client";
import { 
    movementPatterns as movementPatternData,
    userRoles as userRoleData,
    user as userData, 
    admin as adminData,
    exercises as exerciseData,
    plans as planData,
    planSets as planSetData,
    planExercises as planExerciseData
} from './seed.data';
import { hash } from "bcrypt";

const prisma = new PrismaClient();

/** 
 * Delete data from tables with exercise, plan, and workout data. 
 * Don't delete tables with session and user info so that
 * tests can re-use existing sessions.
 **/
async function reset() {
    await prisma.planVolume.deleteMany();
    await prisma.planExercise.deleteMany();
    await prisma.planSet.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.movementPattern.deleteMany();
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
                    id: data.id
                },
                update: {
                    name: data.name,
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

async function seedPlans(admin: User, user: User) {
    const plans = await prisma.$transaction(
        planData(admin, user).map(data => 
            prisma.plan.upsert({
                where: { 
                    id: data.id 
                },
                update: {
                    name: data.name,
                    userEmail: data.userEmail
                },
                create: {
                    id: data.id,
                    name: data.name,
                    userEmail: data.userEmail
                }
            })
        )
    );
    console.log(plans);
    return plans;
}

async function seedPlanSets() {
    const planSets = await prisma.$transaction(
        planSetData.map(data => 
            prisma.planSet.upsert({
                where: {
                    id: data.id
                },
                update: {
                    planId: data.planId,
                    order: data.order
                },
                create: {
                    id: data.id,
                    planId: data.planId,
                    order: data.order
                }
            })
        )
    )
    console.log(planSets);
    return planSets;
}

async function seedPlanExercises() {
    const planExercises = await prisma.$transaction(
        planExerciseData.map(data => {
            return prisma.planExercise.upsert({
                where: {
                    id: data.id
                },
                update: {
                    id: data.id,
                    planSetId: data.planSetId,
                    exerciseId: data.exerciseId,
                    targetVolume: {
                        createMany: {
                            data: data.targetVolume.map(vol => ({
                                id: vol.id,
                                sets: vol.sets,
                                minReps: vol.minReps,
                                maxReps: vol.maxReps,
                                rest: vol.rest
                            }))
                        }
                    },
                    order: data.order
                },
                create: {
                    id: data.id,
                    planSetId: data.planSetId,
                    exerciseId: data.exerciseId,
                    targetVolume: {
                        createMany: {
                            data: data.targetVolume.map(vol => ({
                                id: vol.id,
                                sets: vol.sets,
                                minReps: vol.minReps,
                                maxReps: vol.maxReps,
                                rest: vol.rest
                            }))
                        }
                    },
                    order: data.order
                }
            })}
        )
    )
    console.log(planExercises);
    return planExercises;
}

async function main() {
    await reset();
    await seedUserRoles();
    await seedMovementPatterns();
    const user = await seedUser();
    const admin = await seedAdminUser();
    await seedExercises(admin, user);
    await seedPlans(admin, user);
    await seedPlanSets();
    await seedPlanExercises();
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



    