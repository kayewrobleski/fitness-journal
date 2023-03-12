import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/lib/prisma';
import { validateSessionAndGetUser } from "@/helpers/validateSessionAndGetUser";
import { METHOD_NOT_ALLOWED, NOT_FOUND } from "@/helpers/errors";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    const user = await validateSessionAndGetUser(req, res);
    if (!user) return;

    const planId = parseInt(req.query.planId as string);
    const planSetId = parseInt(req.query.setId as string);

    let planSet;
    try {
        planSet = await prisma.planSet.findFirstOrThrow({
            where: { 
                id: planSetId,
                planId: planId,
                plan: {
                    userEmail: user.email
                }
            },
            include: {
                planExercises: {
                    include: {
                        targetVolume: true
                    }
                }
            }
        })
    }
    catch (NotFoundError) {
        res.status(404).json(NOT_FOUND);
    }

    if (req.method === 'GET') {
        res.status(200).json(planSet);
        return;
    }

    if (req.method === 'PATCH') {
        const updatedSet = await prisma.planSet.update({
            where: { id: planSetId },
            data: {
                order: req.body.order || planSet?.order
            }
        })
        res.status(200).json(updatedSet);
        return;
    }

    if (req.method === 'DELETE') {
        const deletedSet = await prisma.planSet.delete({
            where: { id: planSetId }
        })
        res.status(200).json(deletedSet);
        return;
    }

    res.status(405).json(METHOD_NOT_ALLOWED);
}