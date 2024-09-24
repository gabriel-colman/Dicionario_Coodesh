import axios from "axios";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Word from "../models/word";

dotenv.config();

const FILE_URL = process.env.FILE_URL;
const MONGO_URI = process.env.MONGO_URI;

async function downloadFile(url: string, outputPath: string): Promise<void> {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}

async function readFileContent(filePath: string): Promise<string> {
  try {
    return await fs.promises.readFile(filePath, "utf8");
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

async function saveWordsToMongo(words: string[]): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI as string);
    const wordDocuments = words.map((word) => ({ word }));
    await Word.insertMany(wordDocuments);
    console.log("Words saved to MongoDB successfully!");
  } catch (error) {
    console.error("Error saving words to MongoDB:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

export async function initializeDatabase(): Promise<string> {
  try {
    await mongoose.connect(MONGO_URI as string);

    const existingWordsCount = await Word.countDocuments();
    if (existingWordsCount > 0) {
      console.log("Fullstack Challenge 🏅 - Dictionary");
      await mongoose.disconnect();
      return "Fullstack Challenge 🏅 - Dictionary";
    }

    const tempFilePath = path.join(__dirname, "downloadedWords.txt");
    console.log("Starting download...");
    await downloadFile(FILE_URL as string, tempFilePath);
    console.log("Download complete.");

    console.log("Reading file content...");
    const fileContent = await readFileContent(tempFilePath);
    const words = fileContent.split("\n").filter(Boolean);

    console.log("Saving words to MongoDB...");
    await saveWordsToMongo(words);

    fs.unlinkSync(tempFilePath);
    console.log("Temporary file removed.");

    console.log("Fullstack Challenge 🏅 - Dictionary");
    await mongoose.disconnect();

    return "Fullstack Challenge 🏅 - Dictionary";
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
}
