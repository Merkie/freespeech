import { json } from "solid-start/server";

import { PrismaClient } from "@prisma/client";
import { ILogoutUserRequest } from "~/types/ApiTypes";

// Database client
const prisma = new PrismaClient();

export const post = async ({ request }: { request: Request }) => {
  const body: ILogoutUserRequest = await request.json(); // JSON body of the request

  // Find the session according to the token
  const deleteSession = await prisma.session.deleteMany({
    where: {
      userId: body.userId
    }
  });

  return(json(deleteSession));
};
