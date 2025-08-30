import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) {
      console.log("DB Error: MONGODB_URL is not set");
      return;
    }
    const kind = uri.startsWith("mongodb+srv://") ? "atlas-srv" : uri.startsWith("mongodb://") ? "mongodb" : "unknown";
    console.log(`Connecting to Mongo (${kind})...`);

    await mongoose.connect(uri);

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export default dbConnection;
