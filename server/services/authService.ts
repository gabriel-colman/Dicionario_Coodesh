import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

interface UserPayload {
  name: string;
  email: string;
  password: string;
}
const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("Usuário já existe com e-mail:", email);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.JWT_SECRET as string
  );

  return { user: newUser, token };
};
const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("Credenciais inválidas para o usuário com e-mail:", email);
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { name: user.name, id: user._id, email: user.email },
    process.env.JWT_SECRET as string
  );

  return { user: { name: user.name, email: user.email, id: user._id }, token };
};

export { registerUser, loginUser };
