import NextAuth, { AuthOptions } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
import Cookies from "cookies";
import { encode, decode } from "next-auth/jwt";
import { randomUUID } from "crypto";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = authOptions(req, res);
  return await NextAuth(...data)
}
export default handler;

export function authOptions(
  req: NextApiRequest,
  res: NextApiResponse
) : [ req: NextApiRequest, res: NextApiResponse, options: AuthOptions ] {

  const generateSessionToken = () => {
    return randomUUID();
  }

  const fromDate = (time: number, date = Date.now()) => {
      return new Date(date + time * 1000);
  }

  const adapter = PrismaAdapter(prisma);

  const options: AuthOptions = {
    adapter: adapter,
    callbacks: {
      async signIn({ user, account, profile, email, credentials}) {
        if (
          req.query.nextauth?.includes("callback") && 
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          if (user) {
            const sessionToken = generateSessionToken();
            const sessionMaxAge = 30 * 24 * 60 * 60   // 30 days
            const sessionExpiry = fromDate(sessionMaxAge);

            await adapter.createSession({
              userId: user.id,
              sessionToken: sessionToken,
              expires: sessionExpiry
            });

            const cookies = new Cookies(req, res);

            cookies.set("next-auth.session-token", sessionToken, {
              expires: sessionExpiry
            })
          }
        }
        
        return true;
      },
      async session({ session, user, token }) {
        (session.user as User).role = (user as User).role;
        return session;
      }
    },
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes("callback") && 
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");
          if (cookie) return cookie;
          else return "";
        }
        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes("callback") && 
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }
        return decode({ token, secret });
      }
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
      }),
      CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: {  label: "Password", type: "password" }
        },
        // @ts-ignore
        async authorize(credentials, req) {
  
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
  
          if (!email || !password) {
            throw new Error("Missing username or password");
          }
  
          const user = await prisma.user.findUnique({
            where: {
              email,
            }
          });
  
          // if user doesn't exist or password doesn't match
          if (!user || !user.password || !(await compare(password, (user.password)))) {
            throw new Error("Invalid username or password");
          }
  
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image
          }
        }
      }),
    ]
  }

  return [ req, res, options ];
};

