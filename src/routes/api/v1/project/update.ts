import { APIEvent, json } from "solid-start";
import { z } from "zod";
import prisma from "~/lib/prisma";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const PUT = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    name: z.string().min(2),
    description: z.string(),
    isPublic: z.boolean(),
    image: z.string(),
    projectId: z.string(),
  });

  // Get the data from the request
  const { name, description, isPublic, image, projectId } =
    await request.json();

  // Validate the data
  try {
    schema.parse({
      name,
      description,
      isPublic,
      image,
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
    return json({ message: "Invalid token", success: false }, { status: 401 });
  }

  // fetch the project
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
      { message: "Project does not exist", success: false },
      { status: 404 }
    );
  }

  // update the project
  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name,
      description,
      isPublic,
      image,
    },
  });

  return json({ project: updatedProject, success: true });
};
