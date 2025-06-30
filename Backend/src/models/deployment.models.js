import mongoose from "mongoose";

const deploymentSchema = new mongoose.Schema({
    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    status: {
        type: String,
        enum: ["IDLE","BUILDING","DEPLOYED","FAILED","SUCCESS"],
        default: "IDLE",
    },
    logs:{
        type:[String],
    },
    containerId:{
        type:String,
        required: false, //false only for testing purpose
    },
    buildTime:{
        type: Number,
    }
},
{timestamps:true}
);

export const Deployment = mongoose.model("Deployment",deploymentSchema);