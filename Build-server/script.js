import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function init() {
    console.log("Executing script.js");

    const outDirPath = path.join(__dirname, 'output');

    // Execute the shell command
    const p = exec(`cd ${outDirPath} && npm install && npm start`);

    // Properly attach listeners to stdout and stderr
    p.stdout?.on("data", (data) => {
        console.log(data.toString());
    });

    p.stderr?.on("data", (data) => {
        console.error("Error:", data.toString());
    });

    p.on("close", (code) => {
        console.log(`Build Complete with exit code ${code}`);
    });
}

init();


