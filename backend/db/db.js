import mongoose from "mongoose";

const connectToDb = async () => {
  await mongoose.connect(process.env.URI).then(() => {
    console.log("\nConnected to the database successfully");
  }).catch((error) => {
    console.error("\nDatabase connection error:", error);
    throw error;
  });
}

export { connectToDb };
