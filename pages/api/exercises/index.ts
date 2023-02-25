import { UNAUTHORIZED } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { User, Session } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from '../auth/[...nextauth]';
import { validateSession } from '@/helpers/validateSession';

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

    // const requestData = await authOptions(req, res);
    // const session = await getServerSession(...requestData);
    // let user, isAdmin, email;

    // console.log("Session", JSON.stringify(session));

    const session = await validateSession(req, res);
    const isAdmin = session.user.role === 'admin';
    
    // if (!isValid) {
    //     res.status(403).json({ message: UNAUTHORIZED});
    //     return;
    // } 
    
    // else {
    //     user = session.user as User;
    // }

    if (req.method === 'POST') {

        // Only admin users can create a global exercise
        let isGlobal = req.query.global === 'true' ? true : false;
        if (isGlobal && !isAdmin) {
            res.status(403).json({ message: UNAUTHORIZED});
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
                        id: req.body.movementPatternId
                    }
                },
                user: {
                    connect: {
                        email: session.user.email || ''
                    }
                }
            }  
        })
        res.status(201).json(exercise);
    }

    else {
        const exercises = await prisma.exercise.findMany({
            where: {
                OR: [
                    { userEmail: session.user.email },
                    { global: true }
                ]
            }
        });
        res.status(200).json(exercises);
    }
}