import { execSync } from "child_process";
import path from "path";
import fsExtra from "fs-extra";

const repoUrl = "https://github.com/Tauqeer-Code-Craft/Online-Word.git";
const rootDir = "frontend";
const buildCommand = "npm run build";
const outputDir = "dist";
const containerName = "strange_mendeleev";  // your container name

const localOutputPath = path.resolve(
  "C:/Users/Tauqeer/CodePlayground/web project training/Vercel Clone/deployments/debug-test"
);

try {
  // Ensure local output path exists, clean it before copying
  console.log(`Cleaning local output folder: ${localOutputPath}`);
  fsExtra.removeSync(localOutputPath);
  fsExtra.ensureDirSync(localOutputPath);

  // Check if container is running; start if not
  const isRunning = execSync(`docker inspect -f '{{.State.Running}}' ${containerName}`)
    .toString()
    .trim();

  if (isRunning !== "true") {
    console.log(`Starting existing container: ${containerName}`);
    execSync(`docker start ${containerName}`, { stdio: "inherit" });
  } else {
    console.log(`Container ${containerName} is already running.`);
  }

  // Remove old project folder inside container if exists (cleanup)
  console.log("Cleaning old project folder in container...");
  execSync(`docker exec ${containerName} rm -rf /tmp/project`, { stdio: "inherit" });

  // Clone repo inside container
  console.log("Cloning repo...");
  execSync(
    `docker exec ${containerName} git clone ${repoUrl} /tmp/project`,
    { stdio: "inherit" }
  );

  // List cloned folder
  console.log(`Listing /tmp/project:`);
  execSync(`docker exec ${containerName} ls -la /tmp/project`, { stdio: "inherit" });

  // Install dependencies
  console.log(`Installing dependencies...`);
  execSync(
    `docker exec ${containerName} bash -c "cd /tmp/project/${rootDir} && npm install"`,
    { stdio: "inherit" }
  );

  // Build the project
  console.log(`Building project...`);
  execSync(
    `docker exec ${containerName} bash -c "cd /tmp/project/${rootDir} && ${buildCommand}"`,
    { stdio: "inherit" }
  );

  // List build output folder
  console.log(`Listing build output directory: /tmp/project/${rootDir}/${outputDir}`);
  execSync(
    `docker exec ${containerName} ls -la /tmp/project/${rootDir}/${outputDir}`,
    { stdio: "inherit" }
  );

  // Copy build artifacts to host machine
  console.log("Copying build output to host...");
  execSync(
    `docker cp ${containerName}:/tmp/project/${rootDir}/${outputDir} "${localOutputPath}"`,
    { stdio: "inherit" }
  );

  console.log("✅ Build and copy succeeded.");
} catch (error) {
  console.error("❌ Build failed:", error.message);
}
