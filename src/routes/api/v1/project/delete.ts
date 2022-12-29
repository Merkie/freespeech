import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { z } from "zod";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const DELETE = async ({ request }: APIEvent) => {
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
    return json({ message: "Invalid token" }, { status: 401 });
  }

  // Find the project
  const project = await prisma.project.findFirst({
    where: {
      id,
      user: {
        id: (decoded as User).id,
      },
    },
  });

  // If there is no project with the given id, return an error
  if (!project) {
    return json(
      {
        success: false,
        message: "Project not found.",
      },
      { status: 404 }
    );
  }

  // Delete the project
  const deletedProject = await prisma.project.delete({
    where: {
      id: project.id,
    },
  });

  return json({
    success: true,
    deletedProject,
  });
};
