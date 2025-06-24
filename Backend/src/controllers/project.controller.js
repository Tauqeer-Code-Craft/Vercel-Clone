import Project from "../models/project.models.js"

const handleProjects = async(req,res) => {
    const projects = await Project.find();
    res.json(projects)
}

const handleCreateProject = async(req,res) => {
    const {
        name,
        repoUrl,
        domain,
        rootDir = ".",
        buildCommand = 'npm run build',
        outputDir = "build"

    } = req.body;

    const newProject = new Project ({name, repoUrl, domain,rootDir,buildCommand,outputDir});
    await newProject.save();
    res.json(newProject);
}

export default {handleProjects,handleCreateProject}