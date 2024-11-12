import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/userModel";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import jwt from "jsonwebtoken";

//Register user
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const saltRounds = Number(process.env.SALT_ROUNDS || "10");
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await user.save();

  res.status(201).json(new StandardResponse("User created successfully", user));
};

//Login user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User not found", 400);
  }

  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new CustomError("Invalid credentials", 400);
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY || "",
      {
        expiresIn: "1d",
      }
    );

    const response = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
    };

    res.status(200).json(new StandardResponse("Login successful", response));
  }
};
