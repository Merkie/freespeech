import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { z } from "zod";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const DELETE = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    projectId: z.string(), // id of the project to delete
  });

  // Get the data from the request
  const { projectId } = await request.json();

  // Validate the data
  try {
    schema.parse({
      projectId,
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
    return json({ success: false, message: "Invalid token" }, { status: 401 });
  }

  // find the project
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      user: {
        id: (decoded as User).id,
      },
    },
  });

  // if the project doesnt exist, return an error
  if (!project) {
    return json(
      { success: false, message: "Project does not exist" },
      { status: 404 }
    );
  }

  // delete the project
  const deletedProject = await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return json({ success: true, project: deletedProject });
};
