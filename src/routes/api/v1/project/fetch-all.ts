import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { z } from "zod";

export const GET = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    page: z.number().positive().int(),
    perPage: z.number().positive().int(),
  });

  // Get the data from the request
  const { page = 1, perPage = 10 } = await request.json();

  // Validate the data
  try {
    schema.parse({
      page,
      perPage,
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

  // Find all the projects
  const projects = await prisma.project.findMany({
    where: {
      isPublic: true,
    },
    skip: page * perPage - perPage,
    take: perPage,
  });

  return json({ projects, success: true });
};
