import express from 'express';
import triggerBuild from "../docker/buildRunner.js"

const router = express.Router();

router.post('/test', async (req,res)=>{
    const project = req.body;
    try {
        await triggerBuild(project);
        res.status(200).send('build triggered')
    } catch (error) {
     res.status(500).send("build triggered failed" + error.message)
    }
})

export default router;