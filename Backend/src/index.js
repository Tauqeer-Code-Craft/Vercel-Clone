import express from "express";
import dotenv from 'dotenv';
import cors from "cors"
import connectDB from "./connect.db.js";

//Routes
import projectRoutes from "./routes/project.routes.js";
import deploymentRoutes from "./routes/deployment.routes.js";
import authRoutes from "./routes/auth.routes.js";
import githubRoutes from "./routes/github.routes.js";
import githubWebhookRoutes from "./routes/githubWebhook.routes.js";
import importedRepoRoutes from "./routes/importedRepos.routes.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use('/api/projects',projectRoutes);
app.use('/api/deployments',deploymentRoutes);
app.use('/api', authRoutes);

app.use('/api/github', githubRoutes)

app.use('/api/github', githubWebhookRoutes);

app.use("/api/imported-repos", importedRepoRoutes);

connectDB();



app.listen(PORT,() => {
    console.log(`The server is running at : http://localhost:${PORT}/`);
})

