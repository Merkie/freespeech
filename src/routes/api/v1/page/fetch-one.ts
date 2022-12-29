import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { z } from "zod";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const POST = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    pageId: z.string(),
  });

  // Get the data from the request
  const { pageId } = await request.json();

  // Validate the data
  try {
    schema.parse({
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

  // check if the pageId exists
  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
    },
  });

  // if the page doesnt exist, return an error
  if (!page) {
    return json(
      { message: "Page does not exist", success: false },
      { status: 404 }
    );
  }

  // check if the user owns the page or if page.isPublic === true
  if ((decoded as User).id !== page.userId && !page.isPublic) {
    return json(
      {
        message: "You do not have permissions to view this page",
        success: false,
      },
      { status: 403 }
    );
  }

  return json({ page, success: true });
};
