import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/userModel";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import jwt from "jsonwebtoken";
import mailSender from "../utils/mailSender";
import { Otp } from "../models/otpModel";
import otpGenerator from "otp-generator";

//Register user
const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const saltRounds = Number(process.env.SALT_ROUNDS || "10");
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (!existingUser.verified)
      throw new CustomError(
        "User already exists but not verified",
        400,
        "USER_NOT_VERIFIED"
      );

    throw new CustomError("Email already exists", 400);
  }

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await user.save();

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otpDoc = new Otp({
    email,
    otp,
  });

  await otpDoc.save();

  await mailSender(
    email,
    "Verify your email",
    `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Verify your email</h2>
      <p>Please enter the following OTP to verify your email:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>expires in 10 minutes</p>
      <p>Thank you for registering with us!</p>
    </div>
    `
  );

  res.status(201).json(
    new StandardResponse("Otp send successfully!", {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })
  );
};

//Login user
const login = async (req: Request, res: Response) => {
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

    if (!user.verified) {
      throw new CustomError("User not verified", 400, "USER_NOT_VERIFIED");
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

// Verify OTP for email verification
const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User not found", 400);
  }

  if (user.verified) {
    throw new CustomError(
      "User already verified",
      400,
      "USER_ALREADY_VERIFIED"
    );
  }
  const otpDoc = await Otp.findOne({ email });

  if (!otpDoc) {
    throw new CustomError("Email not found", 400);
  }

  // Check if OTP is expired
  const currentTime = new Date().getTime();
  const otpUpdatedTime = new Date(otpDoc.updatedAt).getTime();
  const timeDifference = (currentTime - otpUpdatedTime) / 1000 / 60;

  if (timeDifference > 10) {
    // 10 minutes
    throw new CustomError("OTP expired", 400);
  }

  if (otp !== otpDoc.otp) {
    throw new CustomError("Invalid OTP", 400);
  }

  await Promise.all([user.updateOne({ verified: true }), otpDoc.deleteOne()]);

  res.status(200).json(new StandardResponse("Email verified successfully!"));
};

// Resend OTP
const reSendOtp = async (req: Request, res: Response) => {
  if (!req.body.email) {
    throw new CustomError("Email is required", 400);
  }

  const { email } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new CustomError("User not found", 400);
  }

  if (existingUser.verified) {
    throw new CustomError(
      "User already verified",
      400,
      "USER_ALREADY_VERIFIED"
    );
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otpDoc = await Otp.findOne({ email });

  await mailSender(
    email,
    "Verify your email",
    `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Verify your email</h2>
      <p>Please enter the following OTP to verify your email:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>expires in 10 minutes</p>
      <p>Thank you for registering with us!</p>
    </div>
    `
  );

  if (otpDoc) {
    await otpDoc.updateOne({ otp });
  } else {
    const newOtp = new Otp({
      email,
      otp,
    });

    await newOtp.save();
  }

  res.status(200).json(
    new StandardResponse("Otp send successfully!", {
      email,
    })
  );
};

// forgot password
const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) throw new CustomError("Email is required", 400);

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User not found", 400);
  }

  const resetToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_KEY || "",
    {
      expiresIn: "10m",
    }
  );

  await mailSender(
    email,
    "Reset your password",
    `
	<div style="font-family: Arial, sans-serif; text-align: center;">
	  <h2>Reset your password</h2>
	  <p>Please click on the following link to reset your password:</p>
	  <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset password</a>
	  <p>expires in 10 minutes</p>
	  <p>Don't share this link with anyone!! </p>
	  <p>Thank you!</p>
	</div>
	`
  );

  res.status(200).json(new StandardResponse("Reset link sent successfully!"));
};

// reset the password using the token
const resetPassword = async (req: Request, res: Response) => {
  const token = req.params.token;

  if (!token) throw new CustomError("Invalid token", 400);

  const { newPassword } = req.body;

  if (!newPassword) throw new CustomError("New Password is required", 400);

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as {
    id: string;
  };
  console.log(decoded);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new CustomError("User not found", 400);
  }

  const saltRounds = Number(process.env.SALT_ROUNDS || "10");
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await user.updateOne({ password: hashedPassword });

  res.status(200).json(new StandardResponse("Password reset successfully!"));
};

export { register, login, reSendOtp, verifyOtp, forgotPassword, resetPassword };
