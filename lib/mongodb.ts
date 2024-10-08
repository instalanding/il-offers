import mongoose from "mongoose"

export async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL || "")
        console.log("Connected to database")
    } catch (error) {
        console.log(error)
    }
}