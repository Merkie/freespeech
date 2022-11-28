import type { UserWithProjects } from "../types";
import prisma from "./resources/prisma";

export default async function (cookie: string): Promise<UserWithProjects> {
  const token = await prisma.accessToken.findUnique({
    where: {
      token: cookie?.split("=")[1] + "",
    },
  });
  if (token) {
    return (await prisma.user.findUnique({
      where: {
        id: token.userId,
      },
      include: {
        projects: true,
      },
    })) as UserWithProjects;
  }
  return {} as UserWithProjects;
}
