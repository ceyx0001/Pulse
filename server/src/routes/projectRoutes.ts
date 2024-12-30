import { Router } from "express";
import { deleteProject, getProjects, postProject } from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.post("/", postProject);
router.delete("/:id", deleteProject);

export default router;
