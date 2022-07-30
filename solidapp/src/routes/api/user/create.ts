import { json } from "solid-start/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

// Types
import { ICreateUserRequestBody } from "~/types/ApiTypes";

// Prisma, database ORM
const prisma = new PrismaClient();

export const post = async({ request }: { request: Request }) => {
    const body: ICreateUserRequestBody = await request.json();

    // Match passwords
    if(body.password !== body.confirmPassword)
        return json({error: 'passwords do not match'});

    // Hash password
    const salt = crypto.randomBytes(16).toString('hex'); 
    const hash = crypto.pbkdf2Sync(body.password, salt, 1000, 64, `sha512`).toString(`hex`); 

    try {
        // Make user object
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                auth: hash,
                authSalt: salt
            }
        });

        // Create new session
        const session = await prisma.session.create({
            data: {
            userId: user.id
            }
        });
        
        return json({token: session.token});
    } catch(e) {
        // Duplicate email error
        if(e.message.includes('email'))
            return json({error: 'email already in use'});
        
        // If error was not caused by email already in use, return error
        return json({error: 'unknown error'});
    }
}