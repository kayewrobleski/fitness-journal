import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from '../auth/[...nextauth]';

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
    // console.log("Req", JSON.stringify(req.headers, null, 2));

    const requestData = await authOptions(req, res);
    const session = await getServerSession(...requestData);
    
    console.log("Session", JSON.stringify(session));

    const token = await getToken({req});
    console.log("JSON Web Token", JSON.stringify(token, null, 2))

    if (req.method === 'POST') {
        const exercise = await prisma.exercise.create({
            data: {
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