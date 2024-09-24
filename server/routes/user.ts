import { Router, Response, NextFunction } from "express";
import authenticateToken from "../middlewares/authenticateToken";
import userService from "../services/userService";
import { RequestCustom } from "../types/express";

const router = Router();
router.get(
  "/me",
  authenticateToken,
  async (req: RequestCustom, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).send("Unauthorized");
      }

      const user = await userService.findUserById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.json({
        email: user.email,
        favorites: user.favorites,
        history: user.history,
      });
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.get(
  "/me/history",
  authenticateToken,
  async (req: RequestCustom, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).send("Unauthorized");
      }

      const user = await userService.findUserById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.json(user.history);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.get(
  "/me/favorites",
  authenticateToken,
  async (req: RequestCustom, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).send("Unauthorized");
      }

      const user = await userService.findUserById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.json(user.favorites);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

export default router;
