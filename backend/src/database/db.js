import mongoose from "mongoose";

const buildMongoUri = () => {
    const baseUrl = process.env.MONGODB_URL || "";
    // If URL already includes a path after host, use as-is. Otherwise append DB_NAME (fallback to eLearning)
    const hasDatabasePath = /mongodb(?:\+srv)?:\/\/[^/]+\//.test(baseUrl) && baseUrl.replace(/\/?$/, "/").split("/").length > 3;
    if (hasDatabasePath) {
        return baseUrl;
    }
    const dbName = process.env.DB_NAME || "eLearning";
    const trimmed = baseUrl.replace(/\/?$/, "");
    return `${trimmed}/${dbName}`;
}

const db = async () => {
    try {
        const uri = buildMongoUri();
        const connectionInstance = await mongoose.connect(uri);
        console.log(`\n MongoDB connected !! DB HOST :: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Mongodb connection error", error);
        process.exit(1)
    }
}



export default db