import express, { Response, Router, NextFunction } from "express";
import { registerUser, loginUser } from "../services/authService";
import { RequestCustom } from "../types/express";

const router: Router = express.Router();

const authenticateUser = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  req.user = { id: "user-id", email: "user@example.com" };
  next();
};
router.post("/register", async (req: RequestCustom, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await registerUser(name, email, password);
    res.status(200).json({
      id: user._id,
      name: user.name,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.post("/login", async (req: RequestCustom, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    console.log("User:", {
      id: user.id,
      email: user.email,
      token,
    });
    res.status(200).json({
      id: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(400).json({ message: (error as Error).message });
  }
});

router.use(authenticateUser);

export default router;
