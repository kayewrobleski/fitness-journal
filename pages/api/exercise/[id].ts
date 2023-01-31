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

    if (id === undefined) {
        res.status(400);
    }

    else if (req.method === 'DELETE') {
        const exercise = await prisma.exercise.delete({
            where: {id: parseInt(id)},
        })
        res.status(200).json(exercise);
    }

    else {
        const exercise = await prisma.exercise.findUnique({
            where: {id: parseInt(id)}
        });
        res.status(200).json(exercise);
    }
    
}