import express from "express";
import { likePost , getUserPosts , getFeedPosts , deletePost } from "../controllers/post.js";
import { verifytoken } from "../middleware/auth.js";

const router = express.Router();

router.get("/all" , getFeedPosts);
router.get("/:id/posts" , getUserPosts);
router.get("/:id/delete", deletePost);

router.patch("/:id/likepost"  , likePost);

export default router;