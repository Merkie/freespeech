import { json } from "solid-start/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

// Types
import { IValidateUserRequestBody } from "~/types/ApiTypes";

// Prisma, database ORM
const prisma = new PrismaClient();

export const post = async({ request }: { request: Request }) => {
    const body: IValidateUserRequestBody = await request.json();

    // Find user by email
    const user = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    });

    // If user not found, return error
    if(!user)
        return json({error: 'user not found'});

    // Hash the password with the user's salt
    const hash = crypto.pbkdf2Sync(body.password, user.authSalt, 1000, 64, `sha512`).toString(`hex`); 

    // If the hash does not match the user's auth hash, return error
    if(hash !== user.auth)
        return json({error: 'invalid password'});

    // Create new session
    const session = await prisma.session.create({
        data: {
          userId: user.id
        }
    });

    // Return a new session token
    return json({token: session.token});
}