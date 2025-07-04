import express from "express";
import { Octokit } from "@octokit/rest";
import { decrypt } from "../utils/crypto.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const router = express.Router();

router.post("/webhooks", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { repoOwner, repoName } = req.body;

  if (!repoOwner || !repoName) {
    return res.status(400).json({ message: "Missing repoOwner or repoName" });
  }

  const webhookUrl = process.env.WEBHOOK_PUBLIC_URL; 

  try {
    const accessToken = decrypt(req.user.accessToken);
    const octokit = new Octokit({ auth: accessToken });

    const hooks = await octokit.repos.listWebhooks({
      owner: repoOwner,
      repo: repoName,
    });

    const existingHook = hooks.data.find(
      (hook) => hook.config?.url === webhookUrl
    );

    if (existingHook) {
      return res.status(200).json({
        message: "Webhook already exists",
        webhookId: existingHook.id,
      });
    }

    const response = await octokit.repos.createWebhook({
      owner: repoOwner,
      repo: repoName,
      config: {
        url: webhookUrl,
        content_type: "json",
        secret: process.env.GITHUB_WEBHOOK_SECRET,
        insecure_ssl: "0",
      },
      events: ["push"],
    });

    return res.status(201).json({
      message: "Webhook created successfully",
      webhookId: response.data.id,
    });
  } catch (err) {
    console.error("Webhook creation failed:", err);

    if (
      err.status === 422 &&
      err.response?.data?.message?.includes("Hook already exists")
    ) {
      return res.status(200).json({ message: "Webhook already exists" });
    }

    return res.status(500).json({ message: "Webhook creation failed" });
  }
});


// ✅ Middleware to verify GitHub signature
function verifyGitHubSignature(req, res, buf) {
  const signature = req.headers["x-hub-signature-256"];
  const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET);
  const digest = `sha256=${hmac.update(buf).digest("hex")}`;

  if (signature !== digest) {
    throw new Error("Webhook signature mismatch");
  }
}

// ✅ Use the signature verification middleware only for this route
router.use(
  "/webhook-handler",
  express.json({ verify: verifyGitHubSignature })
);

// ✅ GitHub webhook handler
router.post("/webhook-handler", (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  console.log("📬 GitHub Webhook Event:", event);
  console.log("📦 Payload:", payload);

  res.sendStatus(200);
});

export default router;
