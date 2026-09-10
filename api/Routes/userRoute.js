import express from "express";
import {
  signup,
  login,
  getMe,
  updateProfile,
} from "../Controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/me/update", auth, updateProfile);

export default router;
