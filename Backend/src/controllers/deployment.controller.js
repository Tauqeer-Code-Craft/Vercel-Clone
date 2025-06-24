import Deployment from "../models/deployment.models.js"

const handleDeployment = async(req,res) => {
    const deployments = await Deployment.find().populate("projectId");
    res.json(deployments);
}

export default {handleDeployment}