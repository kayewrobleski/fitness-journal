import { FORBIDDEN_ADMIN_ONLY, METHOD_NOT_ALLOWED, UNAUTHORIZED } from "@/helpers/errors";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { validateSessionAndGetUser } from '@/helpers/validateSessionAndGetUser';

/**
 * @swagger
 * /api/exercise:
 *   get:
 *     summary: List Exercises
 *     description: Returns all exercises
 *     responses:
 *       200:
 *         description: Exercise object list
 *   post:
 *     summary: Create Exercise
 *     description: Creates a new exercise
 *     responses:   
 *       201:
 *         description: Exercise created
 *       400:
 *         description: Exercise already exists with name
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             name: string
 *             movementPatternId: integer
 *             primaryMuscles: string[]
 *             secondaryMuscles: string[]
 *           example:
 *             name: "Back Squat"
 *             movementPatternId: 1
 *             primaryMuscles: []
 *             secondaryMuscles: []
 */
export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    const user = await validateSessionAndGetUser(req, res);
    if (!user) return;

    if (req.method === 'POST') {

        // Only admin users can create a global exercise
        let isGlobal = req.query.global === 'true' ? true : false;
        let isAdmin = user.role === 'admin';
        if (isGlobal && !isAdmin) {
            res.status(401).json({ message: FORBIDDEN_ADMIN_ONLY});
            return;
        }

        const exercise = await prisma.exercise.create({
            data: {
                name: req.body.name,
                primaryMuscles: req.body.primaryMuscles,
                secondaryMuscles: req.body.secondaryMuscles,
                global: isGlobal,
                movementPattern: {
                    connect: {
                        id: parseInt(req.body.movementPatternId)
                    }
                },
                user: {
                    connect: {
                        email: user.email || ''
                    }
                }
            }  
        })
        res.status(201).json(exercise);
        return;
    }

    if (req.method === 'GET') {
        const exercises = await prisma.exercise.findMany({
            where: {
                OR: [
                    { userEmail: user.email },
                    { global: true }
                ]
            }
        });
        res.status(200).json(exercises);
        return;
    }

    res.status(405).json(METHOD_NOT_ALLOWED);
}