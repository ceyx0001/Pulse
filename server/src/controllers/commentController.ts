import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { parsePrismaError } from "../lib/utils";

const prisma = new PrismaClient();

export const postComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, text, taskId, userId } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        id: id,
        text: text,
        taskId: Number(taskId),
        userId: Number(userId),
      },
    });
    res.status(201).json(newComment);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: parsePrismaError(error, "Error creating comment.") });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId, taskId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: {
        id_taskId: {
          id: Number(commentId),
          taskId: Number(taskId),
        },
      },
    });

    if (!comment) {
      throw new Error(`Comment not found: id=${commentId}, taskId=${taskId}`);
    }

    await prisma.comment.delete({
      where: {
        id_taskId: {
          id: Number(commentId),
          taskId: Number(taskId),
        },
      },
    });

    res.status(204).send();
  } catch (error: any) {
    res
      .status(500)
      .json({ error: parsePrismaError(error, "Error deleting comment.") });
  }
};
