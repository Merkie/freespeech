import { json } from "solid-start/server";
import { PrismaClient } from "@prisma/client";

import { ICreateUserRequestBody } from "~/types/ApiTypes";

const prisma = new PrismaClient();

export const post = async({ request }: { request: Request }) => {
    const body: ICreateUserRequestBody = await request.json();

    // Match passwords
    if(body.password !== body.confirmPassword)
        return json({error: 'passwords do not match'});

    try {
        // Make user object
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                auth: body.password
            }
        });

        // Return user object
        delete user.auth;
        return json(user);
    } catch(e) {
        // Duplicate email error
        if(e.message.includes('email'))
            return json({error: 'email already in use'});
        
        // If error was not caused by email already in use, return error
        return json({error: 'unknown error'});
    }
}