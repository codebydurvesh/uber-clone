import mongoose from "mongoose";

function connectToDb() {
  try {
    mongoose.connect(process.env.URI).then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.log(error, "Failed to connect to MongoDB");
  }
}

export { connectToDb };
