import express from "express";
import axios from "axios";
import { decrypt } from "../utils/crypto.js";

const router = express.Router();

router.get("/repos", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  try {
    const accessToken = decrypt(req.user.accessToken);

    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
      params: {
        per_page: 100,
        sort: "updated",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Error fetching repos:", err.message);
    res.status(500).json({ message: "Failed to fetch repositories" });
  }
});

export default router;
