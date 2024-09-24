import { Router, Request, Response } from "express";
import axios from "axios";
import { findWords, findWordByWord } from "../services/wordService";
import User from "../models/user";
import authenticateToken from "../middlewares/authenticateToken";
import { RequestCustom } from "../types/express";

const router = Router();

router.get("/en", async (req: RequestCustom, res: Response) => {
  const { page, limit, search, startLetter } = req.query;
  const pageNumber = page ? parseInt(page, 10) : undefined;
  const limitNumber = limit ? parseInt(limit, 10) : undefined;

  try {
    const { words, totalDocs, totalPages, hasNext, hasPrev } = await findWords({
      page: pageNumber,
      limit: limitNumber,
      search,
      startLetter,
    });
    console.log({
      results: words.map((word) => word.word),
      totalDocs,
      page: pageNumber,
      totalPages,
      hasNext,
      hasPrev,
    });
    res.json({
      results: words.map((word) => word.word),
      totalDocs,
      page: pageNumber,
      totalPages,
      hasNext,
      hasPrev,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching words", error });
  }
});

router.get("/en/:word", async (req: RequestCustom, res: Response) => {
  const wordParam = req.params.word;

  if (!wordParam) {
    return res.status(400).json({ message: "Word parameter is required" });
  }

  try {
    const word = await findWordByWord(wordParam);

    if (word) {
      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.word}`;
      const apiResponse = await axios.get(apiUrl);

      const phonetics = apiResponse.data[0].phonetics
        .filter((phonetic: any) => phonetic.audio)
        .map((phonetic: any) => ({
          text: phonetic.text,
          audio: phonetic.audio,
        }));

      const definitions = apiResponse.data[0].meanings
        .flatMap((meaning: any) => meaning.definitions)
        .map((definition: any) => definition.definition);

      res.json({ word: word.word, phonetics, definitions });
    } else {
      res.status(404).json({ message: "Word not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching word", error });
  }
});

router.post(
  "/en/:word/favorite",
  authenticateToken,
  async (req: RequestCustom, res: Response) => {
    try {
      const { word } = req.params;

      if (!word) {
        return res.status(400).json({ message: "Word parameter is required" });
      }

      const user = await User.findById(req.user?.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.favorites.includes(word)) {
        return res.status(400).json({ message: "Word already in favorites" });
      }

      user.favorites.push(word);
      await user.save();
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error adding word to favorites", error });
    }
  }
);

router.delete(
  "/en/:word/unfavorite",
  authenticateToken,
  async (req: RequestCustom, res: Response) => {
    try {
      const { word } = req.params;

      if (!word) {
        return res.status(400).json({ message: "Word parameter is required" });
      }

      const user = await User.findById(req.user?.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.favorites = user.favorites.filter((fav) => fav !== word);
      await user.save();
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error removing word from favorites", error });
    }
  }
);

router.post(
  "/en/:word/viewed",
  authenticateToken,
  async (req: RequestCustom, res: Response) => {
    try {
      const { word } = req.params;

      if (!word) {
        return res.status(400).json({ message: "Word parameter is required" });
      }

      const user = await User.findById(req.user?.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.history.includes(word)) {
        user.history.push(word);
      }

      await user.save();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error adding word to history", error });
    }
  }
);

export default router;
