import mongoose from "mongoose";

let memoryServer = null;

const connectWithUri = async (uri) => {
  await mongoose.connect(uri);
  console.log("DB Connected Successfully");
};

const startMemoryServer = async () => {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  console.log("Starting in-memory MongoDB instance...");
  await connectWithUri(uri);
};

const dbConnection = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    if (uri) {
      const kind = uri.startsWith("mongodb+srv://")
        ? "atlas-srv"
        : uri.startsWith("mongodb://")
        ? "mongodb"
        : "unknown";
      console.log(`Connecting to Mongo (${kind})...`);
      await connectWithUri(uri);
      return;
    }

    console.log("MONGODB_URL not set. Falling back to in-memory database.");
    await startMemoryServer();
  } catch (error) {
    console.log("DB Error: " + error);
    console.log("Falling back to in-memory database due to connection failure.");
    try {
      await startMemoryServer();
    } catch (memErr) {
      console.log("In-memory MongoDB start failed: " + memErr);
    }
  }
};

export default dbConnection;
