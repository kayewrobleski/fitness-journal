import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { User } from '@prisma/client';
import { UNAUTHORIZED } from "@/helpers/errors";

export interface InvalidSession {
    isValid: boolean;
}

export interface ValidSession extends InvalidSession {
    user: {
        email: string,
        role: string,
        name: string
    } | undefined;
}

export const validateSessionAndGetUser = async (req: NextApiRequest, res: NextApiResponse) : Promise<User | undefined> => {
    const requestData = authOptions(req, res);
    const session = await getServerSession(...requestData);
    if (!session) {
        res.status(403).json({ message: UNAUTHORIZED});
        return;
    } 
    return session.user as User;
}