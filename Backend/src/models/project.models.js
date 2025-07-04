import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    repoUrl:{
        type: String,
        required: true,
    },
    rootDir:{
        type: String,
        default: ".",
    },
    buildCommand:{
        type: String,
        default: "npm run build",
    },
    outputDir:{
        type: String,
        default: "build",
    },
    domain:{
        type: String,
    },
    status:{
        type: String,
        enums: ["IDLE","BUILDING","DEPLOYED","FAILED"],
        default: "IDLE",
    },

},
{timestamps: true}
);

export const Project = mongoose.model("Project",projectSchema);