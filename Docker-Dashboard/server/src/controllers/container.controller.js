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

export default {handleContainer, handleContainerStart, handleContainerStop, handleContainerDelete}