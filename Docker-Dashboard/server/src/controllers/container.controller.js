import Docker from "dockerode"

const docker = new Docker();

const handleContainer = async (req, res)=>{
    try {
        const containers = await docker.listContainers({all:true});  
        res.json({containers})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

const handleContainerStart = async(req, res)=>{
    try {
        const container = docker.getContainer(req.params.id);
        const containerInfo = await container.inspect().catch(()=>null);
        if (!containerInfo) {
            return res.status(404).json({ error: "Container not found" });
        }
        await container.start();
        res.json({status: "Started"})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const handleContainerStop = async (req,res) => {
    try {
        const container = docker.getContainer(req.params.id);
        const containerInfo = await container.inspect().catch(()=>null);
        if (!containerInfo) {
            return res.status(404).json({ error: "Container not found" });
        }
        await container.stop();
        res.json({status: "Stopped"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }

}

const handleContainerDelete = async (req,res) => {
    try {
        const container = docker.getContainer(req.params.id);
        const containerInfo = await container.inspect().catch(()=>null);
        if (!containerInfo) {
            return res.status(404).json({ error: "Container not found" });
        }
        await container.remove({force: true});
        res.json({status: "Deleted"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }

}


export const handleDeployFromGitHub = async( req, res) => {
    const { repoUrl, username } = req.body;

    if (!repoUrl || !username) {
        return res.status(400).json({ error: "Missing repoUrl or username" });
    }

    const containerName = `deploy-${username}-${Date.now()}`;

    try{
        const container = await docker.createContainer({
            Image: "build-server",
            name: containerName,
            Env: [`GIT_REPOSITORY_URL=${repoUrl}`],
            Tty: true,
            HostConfig: {
                AutoRemove: true,
            },
        });

        await container.start();

        const stream = await container.logs({
            follow: true,
            stdout: true,
            stderr: true,
        });

        stream.on("data", (chunk)=>{
            console.log(`[${containerName}] ${chunk.toString()}`);
        });

        res.status(200).json({
            message: "Hosting Started",
            containerId: container.id,
            containerName,
        });

    }catch (error) {
        console.error("Error deploying from GitHub:", error);
        return res.status(500).json({error: "Failed to deploy from GitHub"});
    }
}

export default {handleContainer, handleContainerStart, handleContainerStop, handleContainerDelete, handleDeployFromGitHub}