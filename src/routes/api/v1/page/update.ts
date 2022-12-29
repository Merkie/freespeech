import { APIEvent, json } from "solid-start";
import { z } from "zod";
import prisma from "~/lib/prisma";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const PUT = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    name: z.string().min(2),
    pageId: z.string(),
  });

  // Get the data from the request
  const { name, pageId } = await request.json();

  // Validate the data
  try {
    schema.parse({
      name,
      pageId,
    });
  } catch (error) {
    // If the data is invalid, return an error
    return json(
      {
        success: false,
        message: "There was an issue with the request data.",
        error: error,
      },
      { status: 400 }
    );
  }

  // decode the json web token
  const decoded = fetchAndValidateToken(request);

  // check if the token is valid
  if (!decoded) {
    return json({ message: "Invalid token", success: false }, { status: 401 });
  }

  // find the page
  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
      user: {
        id: (decoded as User).id,
      },
    },
  });

  // if the page doesnt exist, return an error
  if (!page) {
    return json(
      { message: "Page does not exist", success: false },
      { status: 404 }
    );
  }

  // update the page
  await prisma.page.update({
    where: {
      id: pageId,
    },
    data: {
      name,
    },
  });

  return json({ page, success: true });
};
