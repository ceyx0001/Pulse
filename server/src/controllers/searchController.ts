import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { parsePrismaError } from "../lib/utils";

const prisma = new PrismaClient();

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    const [tasksResult, projectsResult, usersResult] = await Promise.allSettled([
      prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: query as string } },
            { description: { contains: query as string } },
          ],
        },
      }),
      prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: query as string } },
            { description: { contains: query as string } },
          ],
        },
      }),
      prisma.user.findMany({
        where: {
          OR: [{ username: { contains: query as string } }],
        },
      }),
    ]);

    const response: any = {};

    if (tasksResult.status === 'fulfilled') {
      response.tasks = tasksResult.value;
    } else {
      console.error('Task search error:', tasksResult.reason);
      response.taskError = parsePrismaError(tasksResult.reason, "Error searching tasks.");
    }

    if (projectsResult.status === 'fulfilled') {
      response.projects = projectsResult.value;
    } else {
      console.error('Project search error:', projectsResult.reason);
      response.projectError = parsePrismaError(projectsResult.reason, "Error searching projects.");
    }

    if (usersResult.status === 'fulfilled') {
      response.users = usersResult.value;
    } else {
      console.error('User search error:', usersResult.reason);
      response.userError = parsePrismaError(usersResult.reason, "Error searching users.");
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: "An unexpected error occurred during search." });
  }
};
