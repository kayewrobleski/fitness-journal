import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/movement-pattern:
 *   get:
 *     summary: List MovementPatterns
 *     description: Returns all movement patterns
 *     responses:
 *       200:
 *         description: MovementPattern object list
 */
export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    const patterns = await prisma.movementPattern.findMany();
    res.status(200).json(patterns);
}