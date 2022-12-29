import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { fetchAndValidateToken } from "~/lib/token";

export const DELETE = async ({ request }: APIEvent) => {
  // get the user object with id from the request
  const user = fetchAndValidateToken(request);

  if (!user) {
    return json(
      {
        success: false,
        message: "There was an issue with the user token.",
      },
      { status: 400 }
    );
  }

  // check if the user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!existingUser) {
    return json(
      {
        success: false,
        message: "The user does not exist.",
      },
      { status: 404 }
    );
  }

  // delete the user
  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  return json({
    success: true,
  });
};
