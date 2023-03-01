import { validateSessionAndGetUser } from "@/helpers/validateSessionAndGetUser";
import { FORBIDDEN_NO_ACCESS, METHOD_NOT_ALLOWED, NOT_FOUND, UNAUTHORIZED } from "@/helpers/errors";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NotFoundError } from "@prisma/client/runtime";

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
    const user = await validateSessionAndGetUser(req, res);
    if (!user) return;

    if (id === undefined) {
        res.status(400);
        return
    }

    let exercise;
    try {
        exercise = await prisma.exercise.findUniqueOrThrow({
            where: {id: parseInt(id)}
        });
    }
    catch (NotFoundError) {
        res.status(404).json(NOT_FOUND);
        return;
    }

    const wasCreatedByUser = exercise.userEmail === user.email;
    const isGlobal = exercise.global;
    
    if (req.method === 'DELETE') {
        if (!wasCreatedByUser) {
            res.status(401).json(FORBIDDEN_NO_ACCESS);
            return;
        }
        const deletedExercise = await prisma.exercise.delete({
            where: {id: parseInt(id)},
        })
        res.status(200).json(deletedExercise);
        return;
    }

    if (req.method === 'PATCH') {
        if (!wasCreatedByUser) {
            res.status(401).json(FORBIDDEN_NO_ACCESS);
            return;
        }
        const updatedExercise = await prisma.exercise.update({
            where: {id: parseInt(id)},
            data: {
                name: req.body.name,
                movementPatternId: req.body.movementPatternId,
                primaryMuscles: req.body.primaryMuscles,
                secondaryMuscles: req.body.secondaryMuscles
            }
        })
        res.status(200).json(updatedExercise);
        return;
    }

    if (req.method === 'GET') {
        if (!wasCreatedByUser && !isGlobal) {
            res.status(401).json(FORBIDDEN_NO_ACCESS);
            return;
        }
        res.status(200).json(exercise);
    }

    res.status(405).json(METHOD_NOT_ALLOWED);
}