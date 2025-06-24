import express from "express";
import deploymentController from "../controllers/deployment.controller";

const router = express.Router();

router.get('/',deploymentController.handleDeployment);

export default router;