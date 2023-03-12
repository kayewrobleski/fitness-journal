import { METHOD_NOT_ALLOWED } from "@/helpers/errors";
import { validateSessionAndGetUser } from "@/helpers/validateSessionAndGetUser";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {

    const user = await validateSessionAndGetUser(req, res);
    if (!user) return;

    if (req.method === 'GET') {
        const plans = await prisma.plan.findMany({
            where: { userEmail: user.email || '' }
        });
        res.status(200).json(plans);
        return;
    }

    if (req.method === 'POST') {
        const plan = await prisma.plan.create({
            data: {
                name: req.body.name,
                user: {
                    connect: {
                        email: user.email
                    }
                }
            }
        })
        res.status(201).json(plan);
        return;
    }

    res.status(405).json(METHOD_NOT_ALLOWED);
}