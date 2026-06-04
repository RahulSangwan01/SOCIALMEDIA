import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  commentPost,
  createPost,
  deletePost,
  getComments,
  getPost,
  getPosts,
  getUserPost,
  likePost,
  likePostComment,
  replyPostComment,
} from "../controllers/postController.js";

const router = express.Router();

// create post
router.post("/create-post", userAuth, createPost);

// get posts
router.post("/", userAuth, getPosts);

// specific routes BEFORE /:id
router.post("/get-user-post/:id", userAuth, getUserPost);
router.post("/like/:id", userAuth, likePost);
router.post("/like-comment/:id/:rid?", userAuth, likePostComment);
router.post("/comment/:id", userAuth, commentPost);
router.post("/reply-comment/:id", userAuth, replyPostComment);

// get comments
router.get("/comments/:postId", getComments);

// delete post
router.delete("/:id", userAuth, deletePost);

// generic /:id MUST be last
router.post("/:id", userAuth, getPost);

export default router;