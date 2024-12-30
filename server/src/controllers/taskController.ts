import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { parsePrismaError } from "../lib/utils";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.query;
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.status(200).json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: parsePrismaError(error, "Error getting tasks.") });
  }
};

export const postTask = async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: parsePrismaError(error, "Error creating task.") });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;
    const { taskId } = req.params;
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.status(200).json(updatedTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: parsePrismaError(error, "Error updating task status.") });
  }
};

export const updateTaskPoints = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { points } = req.body;
    const { taskId } = req.params;
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        points: points,
      },
    });
    res.status(200).json(updatedTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: parsePrismaError(error, "Error updating task points.") });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.status(200).json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: parsePrismaError(error, "Error getting user tasks.") });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId, _userId } = req.params;

    await prisma.task.delete({
      where: {
        id: Number(taskId),
      },
    });
    
    res.status(204).send();
  } catch (error: any) {
    res
      .status(500)
      .json({ error: parsePrismaError(error, "Error deleting task.") });
  }
};
