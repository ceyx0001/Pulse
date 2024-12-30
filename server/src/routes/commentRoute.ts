import { Router } from "express";
import {
  deleteComment,
  postComment,
} from "../controllers/commentController";

const router = Router();

router.post("/commentId", postComment);
router.delete("/:commentId", deleteComment);

export default router;
