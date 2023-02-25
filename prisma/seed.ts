import { PrismaClient } from '@prisma/client';
import { User } from "@prisma/client";
import { 
    user as userData, 
    admin as adminData,
    exercises as exerciseData 
} from './seed.data';
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function seedUserRoles() {
    const admin = await prisma.userRole.upsert({
        where: { role: 'admin' },
        update: {},
        create: {
            role: 'admin'
        }
    });
    const user = await prisma.userRole.upsert({
        where: { role: 'user' },
        update: {},
        create: {
            role: 'user'
        }
    })
    console.log({
        admin,
        user
    });
}

async function seedMovementPatterns() {
    const squat = await prisma.movementPattern.upsert({
        where: { name: 'squat' },
        update: {},
        create: {
            name: 'squat'
        }
    });
    const hinge = await prisma.movementPattern.upsert({
        where: { name: 'hinge' },
        update: {},
        create: {
            name: 'hinge'
        }
    });
    const bridge = await prisma.movementPattern.upsert({
        where: { name: 'bridge' },
        update: {},
        create: {
            name: 'bridge'
        }
    });
    const lateralRotary = await prisma.movementPattern.upsert({
        where: { name: 'lateral rotary' },
        update: {},
        create: {
            name: 'lateral rotary'
        }
    });
    const upperBodyPush = await prisma.movementPattern.upsert({
        where: { name: 'upper-body push'},
        update: {},
        create: {
            name: 'upper-body push'
        }
    });
    const upperBodyPull = await prisma.movementPattern.upsert({
        where: { name: 'upper-body pull'},
        update: {},
        create: {
            name: 'upper-body pull'
        }
    });
    const singleJoint = await prisma.movementPattern.upsert({
        where: { name: 'single-joint'},
        update: {},
        create: {
            name: 'single-joint'
        }
    });
    console.log({
        squat,
        hinge,
        bridge,
        lateralRotary,
        upperBodyPush,
        upperBodyPull,
        singleJoint
    });
}

async function main() {
    await seedUserRoles();
    await seedMovementPatterns();
}

main()
    .then(async() => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })