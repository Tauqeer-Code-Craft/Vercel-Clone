import express from "express";
import dotenv from 'dotenv';
import cors from "cors"
import connectDB from "./connect.db.js";

//Routes
import projectRoutes from "./routes/project.routes.js";
import deploymentRoutes from "./routes/deployment.routes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/projects',projectRoutes);
app.use('/api/deployments',deploymentRoutes);

connectDB();

app.listen(PORT,() => {
    console.log(`The server is running at : http://localhost:${PORT}/`);
})

