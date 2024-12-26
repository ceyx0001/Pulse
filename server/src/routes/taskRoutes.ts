import { Router } from "express";
import {
  getTasks,
  getUserTasks,
  postTask,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", postTask);
router.patch("/:taskId/status", updateTaskStatus);
router.get("/user/:userId", getUserTasks);

export default router;
