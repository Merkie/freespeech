import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { z } from "zod";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const POST = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    id: z.string(),
  });

  // Get the data from the request
  const { id } = await request.json();

  // Validate the data
  try {
    schema.parse({
      id,
    });
  } catch (error) {
    return json(
      {
        success: false,
        message: "There was an issue with the request data.",
        error: error,
      },
      { status: 400 }
    );
  }

  const decoded = fetchAndValidateToken(request);

  // check if the token is valid
  if (!decoded) {
    return json({ message: "Invalid token" }, { status: 401 });
  }

  // fetch the project
  const project = await prisma.project.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  // check if the project exists
  if (!project) {
    return json(
      { message: "Project not found", success: false },
      { status: 404 }
    );
  }

  // check if the project is public or owned by the user
  if (project.isPublic || (decoded as User).id === project.user.id) {
    return json({ project, success: true });
  }

  return json({ message: "Unauthorized", success: false }, { status: 401 });
};
