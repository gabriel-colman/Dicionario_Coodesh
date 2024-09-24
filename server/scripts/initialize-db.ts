import "dotenv/config";
import { initializeDatabase } from "../services/fileService";

const run = async () => {
  try {
    const message = await initializeDatabase();
    console.log(message);
  } catch (error) {
    console.error("Error during database initialization:", error);
    process.exit(1);
  }
};

run();
