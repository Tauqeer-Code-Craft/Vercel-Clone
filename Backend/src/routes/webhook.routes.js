import express from "express";
import webhookController from "../controllers/webhook.controller.js";

const router = express.Router();

router.get('/',webhookController.handleWebhook)

export default router;