import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

main()
    .then(async() => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })