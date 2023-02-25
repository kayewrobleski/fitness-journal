import { validateSession } from "@/helpers/validateSession";
import { UNAUTHORIZED } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/exercise/{id}:
 *   get:
 *     summary: Get Exercise
 *     description: Returns exercise with the given ID
 *     responses:
 *       200:
 *         description: Exercise object
 *     parameters:
 *     - name: id
 *       in: path
 *       description: ID of exercise to find
 *       required: true
 *   put:
 *     summary: Update Exercise
 *     description: Updates exercise with the given ID
 *     responses:
 *       201:
 *         description: Exercise updated
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               name: string
 *               movementPatternId: integer
 *               primaryMuscles: string[]
 *               secondaryMuscles: string[]
 *             example:
 *               name: "Back Squat"
 *               movementPatternId: 1
 *               primaryMuscles: []
 *               secondaryMuscles: []
 *     parameters:
 *     - name: id
 *       in: path
 *       description: ID of exercise to update
 *       required: true
 *   delete:
 *     summary: Delete Exercise
 *     description: Returns exercise object that was deletd
 *     responses:
 *       200:
 *         description: Exercise deleted
 *     parameters:
 *     - name: id
 *       in: path
 *       description: ID of exercise to delete
 *       required: true
 */
export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.query.id as string;
    const session = await validateSession(req, res);

    if (id === undefined) {
        res.status(400);
    }

    else if (req.method === 'DELETE') {
        const exercise = await prisma.exercise.delete({
            where: {id: parseInt(id)},
        })
        res.status(200).json(exercise);
    }

    else if (req.method === 'PUT') {
        const exercise = await prisma.exercise.update({
            where: {id: parseInt(id)},
            data: {
                name: req.body.name,
                movementPatternId: req.body.movementPatternId,
                primaryMuscles: req.body.primaryMuscles,
                secondaryMuscles: req.body.secondaryMuscles
            }
        })
        res.status(200).json(exercise);
    }

    else {
        const exercise = await prisma.exercise.findUnique({
            where: {id: parseInt(id)}
        });

        if (exercise?.global || exercise?.userEmail == session.user.email) {
            res.status(200).json(exercise);
        } {
            res.status(403).json(UNAUTHORIZED);
        }
    }
    
}