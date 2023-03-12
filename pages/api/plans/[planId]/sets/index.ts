import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/lib/prisma';
import { validateSessionAndGetUser } from "@/helpers/validateSessionAndGetUser";
import { FORBIDDEN_NO_ACCESS, METHOD_NOT_ALLOWED, NOT_FOUND } from "@/helpers/errors";
import { PostPlanExerciseInput, PostPlanVolumeInput } from "@/lib/types";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    const user = await validateSessionAndGetUser(req, res);
    if (!user) return;

    const planId = parseInt(req.query.planId as string);
    const plan = await prisma.plan.findUnique({
        where: { id: planId }
    });

    if (!plan) {
        res.status(404).json(NOT_FOUND);
        return;
    }

    if (plan?.userEmail !== user.email) {
        res.status(401).json(FORBIDDEN_NO_ACCESS);
        return;
    }

    // Check exercise ids
    if (req.body.planExercises?.length > 0) {
        const exerciseIds = req.body.planExercises.map((e : PostPlanExerciseInput) => e.exerciseId);
        const invalidExercises = await prisma.exercise.findMany({
            where: { 
                id: { in: exerciseIds },
                global: false,
                userEmail: { not: user.email }
            }
        })
        // If any provided exercises were create by another user, return 401
        if (invalidExercises.length > 0) {
            res.status(401).json(FORBIDDEN_NO_ACCESS);
            return;
        }
    }

    if (req.method === 'POST') {

        const volumeData = ( data : PostPlanVolumeInput ) => ({
            sets: parseInt(data.sets),
            minReps: parseInt(data.minReps),
            maxReps: parseInt(data.maxReps),
            rest: parseInt(data.rest)
        });
        const exerciseData = ( data : PostPlanExerciseInput ) => ({
            exercise: {
                connect: { id: parseInt(data.exerciseId)}
            },
            order: parseInt(data.order),
            targetVolume: {
                createMany: {
                    data: data.targetVolume?.map(volumeData) || []
                }
            }
        });
        const newSet = await prisma.planSet.create({
            data: {
                planId: planId,
                order: parseInt(req.body.order),
                planExercises: {
                    create: req.body.planExercises?.map(exerciseData) || []
                }  
            },
            include: {
                planExercises: {
                    include: {
                        targetVolume: true
                    }
                }
            }
        });
        res.status(201).json(newSet);
        return;
    }

    if (req.method === 'GET') {
        const sets = await prisma.planSet.findMany({
            where: { planId: planId }
        });
        res.status(200).json(sets);
    }

    res.status(405).json(METHOD_NOT_ALLOWED);
}