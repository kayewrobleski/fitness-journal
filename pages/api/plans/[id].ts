import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateSessionAndGetUser } from "@/helpers/validateSessionAndGetUser";
import { FORBIDDEN_NO_ACCESS, NOT_FOUND } from "@/helpers/errors";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    const user = await validateSessionAndGetUser(req, res);
    if (!user) return;

    const id = req.query.id as string;
    let plan;

    try {
        plan = await prisma.plan.findUniqueOrThrow({
            where: { id: parseInt(id) },
            include: {
                planSets: {
                    include: {
                        planExercises: {
                            include: {
                                targetVolume: true
                            }
                        }
                    }
                }
            }
        });
    }
    catch (NotFoundError) {
        res.status(404).json(NOT_FOUND);
        return;
    }

    if (plan?.userEmail !== user.email) {
        res.status(401).json(FORBIDDEN_NO_ACCESS);
        return;
    }

    if (req.method === 'PATCH') {
        const updatedPlan = await prisma.plan.update({
            where: { id: parseInt(id) },
            data: {
                name: req.body.name
            }
        });
        res.status(200).json(updatedPlan);
        return;
    }

    if (req.method === 'DELETE') {
        const deletedPlan = await prisma.plan.delete({
            where: { id: parseInt(id) },
        })
        res.status(200).json(deletedPlan);
    }

    res.status(200).json(plan);
}