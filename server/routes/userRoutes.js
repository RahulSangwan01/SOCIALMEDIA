import express from "express";
import path from "path";
import {
  acceptRequest,
  changePassword,
  friendRequest,
  getFriendRequest,
  getUser,
  requestPasswordReset,
  resetPassword,
  profileViews,
  suggestedFriends,
  updateUser,
  verifyEmail,
} from "../controllers/userController.js";
import userAuth from "../middleware/authMiddleware.js";
import { deleteUser } from "../controllers/userController.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

// Email Verification
router.get("/verify/:userId/:token", verifyEmail);

// Password Reset Routes
router.post("/request-passwordreset", requestPasswordReset);
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/reset-password", changePassword);

// User Routes
router.post("/get-user/:id?", userAuth, getUser);  // Optional ID for user profile
router.put("/update-user", userAuth, updateUser);  // Update user details

// Friend Request Routes
router.post("/friend-request", userAuth, friendRequest);  // Send a friend request
router.post("/get-friend-request", userAuth, getFriendRequest);  // Get pending friend requests

// Accept/Deny Friend Request
router.post("/accept-request", userAuth, acceptRequest);  // Accept or deny a friend request

// Suggested Friends
router.post("/suggested-friends", userAuth, suggestedFriends);  // Get suggested friends


// Add the delete user route
router.delete("/delete-user", userAuth, deleteUser);  // Add the delete user route

// view profile
router.post("/profile-view", userAuth, profileViews);


// Serve static files for verification and reset password pages
router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));  // Serve email verification page
});

router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));  // Serve reset password page
});

export default router;
