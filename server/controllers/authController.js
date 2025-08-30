import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate fields
  if (!firstName || !lastName || !email || !password) {
    next("Provide Required Fields!");
    return;
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email Address already exists");
      return;
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Send email verification to user
    await sendVerificationEmail(user, res);
  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      next("Please Provide User Credentials");
      return;
    }

    // Development fallback when DB is unavailable or email not found
    if (process.env.ALLOW_DEV_LOGIN === "true") {
      const mockUser = {
        _id: "dev-user",
        firstName: "Dev",
        lastName: "User",
        email,
        profileUrl: "",
        profession: "",
        friends: [],
        verified: true,
      };
      const token = createJWT(mockUser._id);
      return res.status(201).json({
        success: true,
        message: "Login successfully (dev mode)",
        user: mockUser,
        token,
      });
    }

    // Find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    if (!user) {
      next("Invalid email or password");
      return;
    }

    if (!user.verified && process.env.SKIP_EMAIL_VERIFICATION !== "true") {
      next(
        "User email is not verified. Check your email account and verify your email"
      );
      return;
    }

    // Compare password
    const isMatch = await compareString(password, user.password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;

    const token = createJWT(user._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};
