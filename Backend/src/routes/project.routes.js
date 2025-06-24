import express from "express";
import projectController from "../controllers/project.controller";

const router = express.Router();

//get all projects
router.get('/',projectController.handleProjects);

//Create new project
router.post('/',projectController.handleCreateProject);

export default router;