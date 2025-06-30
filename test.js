import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const repoUrl = "https://github.com/Tauqeer-Code-Craft/Online-Word.git";
const rootDir = "frontend";
const buildCommand = "npm run build";
const outputDir = "dist";
const containerName = "debug-build-container";

// Change this to your local output folder (make sure it exists)
const localOutputPath = path.resolve(
  "C:/Users/Tauqeer/CodePlayground/web project training/Vercel Clone/deployments/debug-test"
);

fs.mkdirSync(localOutputPath, { recursive: true });

try {
  console.log("Creating container...");
  execSync(`docker rm -f ${containerName}`, { stdio: "ignore" }); // cleanup if exists
} catch (e) {
  // ignore if container doesn't exist
}

execSync(
  `docker create --name ${containerName} node:18 tail -f /dev/null`,
  { stdio: "inherit" }
);

execSync(`docker start ${containerName}`, { stdio: "inherit" });

try {
  console.log("Cloning repo...");
  execSync(
    `docker exec ${containerName} git clone ${repoUrl} /app/project`,
    { stdio: "inherit" }
  );

  console.log(`Listing /app/project:`);
  execSync(`docker exec ${containerName} ls -la /app/project`, { stdio: "inherit" });

  console.log(`Installing dependencies...`);
  execSync(
    `docker exec ${containerName} bash -c "cd /app/project/${rootDir} && npm install"`,
    { stdio: "inherit" }
  );

  console.log(`Building project...`);
  execSync(
    `docker exec ${containerName} bash -c "cd /app/project/${rootDir} && ${buildCommand}"`,
    { stdio: "inherit" }
  );

  console.log(`Listing build output directory: /app/project/${rootDir}/${outputDir}`);
  execSync(
    `docker exec ${containerName} ls -la /app/project/${rootDir}/${outputDir}`,
    { stdio: "inherit" }
  );

  console.log(`Copying build output to host...`);
  execSync(
    `docker cp ${containerName}:/app/project/${rootDir}/${outputDir} "${localOutputPath}"`,
    { stdio: "inherit" }
  );

  console.log("Build and copy succeeded.");
} catch (error) {
  console.error("Build failed:", error.message);
} finally {
  console.log("Cleaning up container...");
  execSync(`docker rm -f ${containerName}`, { stdio: "inherit" });
}
