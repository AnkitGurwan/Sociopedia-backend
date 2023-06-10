import express from "express";
import {
    getUser,getUserFriends,addRemoveFriend
} from "../controllers/user.js";
import { verifytoken } from "../middleware/auth.js";

const router = express.Router();

//get details
router.get("/:id" , getUser);
router.get("/:id/friends" , getUserFriends);

// update
router.get("/:id/:friendId" , addRemoveFriend);

export default router;

