import http from "http";
import { app } from "./app.js";
import { connectToDb } from "./db/db.js";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

connectToDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
