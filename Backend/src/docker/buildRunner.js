import { execSync } from "child_process";
import fsExtra from "fs-extra";
import path from "path";
import { Deployment } from "../models/deployment.models.js";

const triggerBuild = async (Project) => {
  const id = Project._id.toString();
  const { repoUrl, rootDir, buildCommand, outputDir } = Project;

  // Adjust paths
  const containerName = `build_runner_${id}`; // unique container name per build
  const containerProjectPath = "/tmp/project"; // writable path inside container

  // Host local output folder where build artifacts will be copied
  const localOutputPath = path.resolve(
    "C:/Users/Tauqeer/CodePlayground/web project training/Vercel Clone/deployments",
    id
  );

  // Create new deployment record (adjust as per your DB schema)
  const deployment = new Deployment({
    projectId: id,
    status: "BUILDING",
    logs: [],
    deployedAt: null,
  });
  await deployment.save();

  try {
    // Create and start container
    execSync(`docker create --name ${containerName} secure-node-runner tail -f /dev/null`);
    execSync(`docker start ${containerName}`);

    // Clean previous project folder in container (if any)
    execSync(`docker exec ${containerName} rm -rf ${containerProjectPath}`);

    // Clone the repo inside container
    const cloneCmd = `docker exec ${containerName} git clone ${repoUrl} ${containerProjectPath}`;
    deployment.logs.push(`Cloning repo: ${cloneCmd}`);
    execSync(cloneCmd);

    // Install dependencies
    const installCmd = `docker exec ${containerName} bash -c "cd ${containerProjectPath}/${rootDir} && npm install"`;
    deployment.logs.push(`Installing dependencies: ${installCmd}`);
    execSync(installCmd);

    // Build command
    const buildCmd = `docker exec ${containerName} bash -c "cd ${containerProjectPath}/${rootDir} && ${buildCommand}"`;
    deployment.logs.push(`Building project: ${buildCmd}`);
    execSync(buildCmd);

    // Verify output directory exists in container
    const checkOutputCmd = `docker exec ${containerName} bash -c "[ -d ${containerProjectPath}/${rootDir}/${outputDir} ] && echo exists"`;
    const outputExists = execSync(checkOutputCmd).toString().trim();
    if (outputExists !== "exists") {
      throw new Error(`Build output directory does not exist in container at ${containerProjectPath}/${rootDir}/${outputDir}`);
    }

    // Clean local output folder before copy
    fsExtra.removeSync(localOutputPath);
    fsExtra.ensureDirSync(localOutputPath);

    // Copy build output to host
    const dockerCpCmd = `docker cp ${containerName}:${containerProjectPath}/${rootDir}/${outputDir} "${localOutputPath}"`;
    deployment.logs.push(`Copying build output: ${dockerCpCmd}`);
    execSync(dockerCpCmd);

    // Update deployment status
    deployment.status = "SUCCESS";
    deployment.deployedAt = new Date();
    await deployment.save();

    console.log(`✅ Build succeeded. Artifacts at: ${localOutputPath}`);
  } catch (error) {
    console.error("❌ Build failed:", error);
    deployment.status = "FAILED";
    deployment.logs.push("Error: " + error.message);
    await deployment.save();
  } finally {
    // Cleanup container after build
    try {
      execSync(`docker rm -f ${containerName}`);
    } catch {
      console.warn(`⚠️ Failed to remove container ${containerName}`);
    }
  }
};

export default triggerBuild;
