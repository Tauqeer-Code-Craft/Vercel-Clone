import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("DB Connected")
    } catch (error) {
        console.error(error)
    }
}

export default connectDB