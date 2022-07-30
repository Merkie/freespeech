import { json } from "solid-start/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

// Types
import { IMeRequestBody } from "~/types/ApiTypes";

// Prisma, database ORM
const prisma = new PrismaClient();

export const post = async({ request }: { request: Request }) => {
    const body: IMeRequestBody = await request.json();

    // Find user by email
    const session = await prisma.session.findFirst({
      where: {
        token: body.token
      }
    });

    // If session not found, return error
    if(!session)
      return json({error: 'session not found'});

    // Find user by id
    const user = await prisma.user.findFirst({
      where: {
        id: session.userId
      }
    });

    // If no user found, return error
    if(!user)
      return json({error: 'user not found'});
    
    // Delete auth fields
    delete user.auth;
    delete user.authSalt;
    delete user.authType;

    // Return user
    return json({data: user});
}