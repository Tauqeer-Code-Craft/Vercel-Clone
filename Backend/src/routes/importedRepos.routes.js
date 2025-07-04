import express from 'express';
import ImportedRepo from '../models/ImportedRepo.models.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, repo } = req.body;

    if (!userId || !repo?.id) {
    return res.status(400).json({ message: "Missing userId or repo" });
  }

  try {
    const exists = await ImportedRepo.findOne({ userId, repoId: repo.id });
    if (exists) return res.status(200).json({ success: true, already: true });

    const newRepo = await ImportedRepo.create({
      userId,
      repoId: repo.id,
      name: repo.name,
      html_url: repo.html_url,
      private: repo.private,
      owner: {
        login: repo.owner?.login,
        id: repo.owner?.id,
      },
    });
    res.status(201).json({ success: true, repo: newRepo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const repos = await ImportedRepo.find({ userId });
    res.status(200).json(repos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;