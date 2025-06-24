import mongoose from "mongoose";

const deployment = new mongoose.Schema({
    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    status: {
        type: String,
        enums: ["IDLE","BUILDING","DEPLOYED","FAILED"],
        default: "IDLE",
    },
    logs:{
        type:[String],
    },
    containerId:{
        type:String,
        required: true,
    },
    buildTime:{
        type: Number,
    }
},
{timestamps:true}
);

export const Deployment = mongoose.model("Deployment",deployment);