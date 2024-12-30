import { Router } from "express";
import {
  deleteComment,
  postComment,
} from "../controllers/commentController";

const router = Router();

router.post("/", postComment);
router.delete("/:commentId/task/:taskId/", deleteComment);

export default router;
