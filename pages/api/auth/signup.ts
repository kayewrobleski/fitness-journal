import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({
      message: `Method ${req.method} Not Allowed`,
    });
    return;
  }

  console.log(JSON.stringify(req.body));
  const { name, email, password, confirm, csrfToken } = req.body

  /**
   * Validate signup info
   */
  if (
    !(name && email && password && confirm && password.length >= 1)
  ) {
    res.status(400).json({
      message: "Invalid user parameters",
    })
    return;
  }

  /**
   * Validate that password and password confirmation match
   */
  if (password != confirm) {
    res.status(400).json({
      message: "Password mismatch",
    });
    return;
  }

  /**
   * Check if user already exists
   */
  const exists = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (exists) {
    res.status(403).json({
      message: "User already exists"
    });
    return;
  } 
  
  /**
   * Create new user profile
   */
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: await hash(password, 10),
    },
  });

  if (!user) {
    res.status(500).json({
      message: "Unable to create user profile",
    });
    return;
  }

  /**
   * Create new user account
   */
  const account = await prisma.account.create({
    data: {
      userId: user.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: user.id,
    },
  })

  if (user && account) {
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(500).json({
      message: "Unable to link account to created user profile",
    });
  }
}
