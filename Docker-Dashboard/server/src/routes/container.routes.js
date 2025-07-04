import express from "express";
import containerController from "../controllers/container.controller.js";
const router = express.Router();


router.get('/',containerController.handleContainer)

router.post("/:id/start", containerController.handleContainerStart)

router.post('/:id/stop',containerController.handleContainerStop)

router.delete('/:id',containerController.handleContainerDelete)

router.post('/deploy', containerController.handleDeployFromGitHub)

export default router;