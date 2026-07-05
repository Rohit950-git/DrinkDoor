import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // Get URI from environment
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "❌ Please define the MONGODB_URI environment variable in .env.local"
    );
  }

  // Create connection only once
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName: "DrinkDoor",
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }

  return cached.conn;
}