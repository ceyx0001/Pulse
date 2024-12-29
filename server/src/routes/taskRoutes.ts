import { Router } from "express";
import {
  deleteTask,
  getTasks,
  getUserTasks,
  postTask,
  updateTaskComments,
  updateTaskPoints,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.get("/user/:userId", getUserTasks);

router.post("/", postTask);

router.patch("/:taskId/status", updateTaskStatus);
router.patch("/:taskId/comments", updateTaskComments);
router.patch("/:taskId/points", updateTaskPoints);

router.delete("/:taskId/user/:userId", deleteTask);

export default router;
