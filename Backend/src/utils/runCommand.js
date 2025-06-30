import { exec } from "child_process"

const runCommand = async (command,timeout = 180000) => {
    return new Promise((resolve, reject) => {
        const child = exec(command,{timeout},(err,stdout,stderr)=>{
            if(err) return reject(stderr || err.message)
            resolve(stdout || stderr)
        })
    })
} 

export default runCommand;