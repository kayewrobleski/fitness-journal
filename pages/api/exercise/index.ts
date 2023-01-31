import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

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
 *     summary: Upsert Exercise
 *     description: Create a new exercise or update an existing one
 *     responses:
 *       201:
 *         description: Exercise created or updated
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

    if (req.method === 'POST') {
        const exercise = await prisma.exercise.upsert({
            where: {name: req.body.name},
            update: {
                movementPatternId: req.body.movementPatternId,
                primaryMuscles: req.body.primaryMuscles,
                secondaryMuscles: req.body.secondaryMuscles
            },
            create: {
                name: req.body.name,
                movementPatternId: req.body.movementPatternId,
                primaryMuscles: req.body.primaryMuscles,
                secondaryMuscles: req.body.secondaryMuscles
            }
        })
        res.status(201).json(exercise);
    }

    else {
        const exercises = await prisma.exercise.findMany();
        res.status(200).json(exercises);
    }
    
}