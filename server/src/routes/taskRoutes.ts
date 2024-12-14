import { Router } from "express";
import {
  getTasks,
  postTask,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", postTask);
router.patch("/:taskId/status", updateTaskStatus);

export default router;
