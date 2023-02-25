import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { User } from '@prisma/client';
import { UNAUTHORIZED } from "@/lib/errors";

export interface ValidatedSession {
    user: {
        email: string,
        role: string,
        name: string
    }
}

export const validateSession = async (req: NextApiRequest, res: NextApiResponse) : Promise<ValidatedSession> => {
    const requestData = authOptions(req, res);
    const session = await getServerSession(...requestData);
    
    if (!session) {
        res.status(403).json({ message: UNAUTHORIZED});
    } 

    const user = session?.user as User;
    return {
        user: {
            email: user.email || '',
            role: user.role || '',
            name: user.name || ''
        }
    }
}