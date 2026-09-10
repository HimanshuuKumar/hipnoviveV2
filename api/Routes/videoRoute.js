import {
  createContent,
  getVideos,
  getSingleVideo,
  setViews,
  addLike,
  addComment,
  getComments,
  getMyVideos,
  deleteVideo,
  searchVideos,
} from "../Controllers/videoController.js";
import express from "express";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/create", auth, createContent);

router.get("/get", getVideos);
router.get("/single/:id", getSingleVideo);
router.post("/view/:id", setViews);
router.post("/like/:id", auth, addLike);
router.post("/comment/:id", auth, addComment);
router.get("/comments/:id", getComments);
router.get("/my-content", auth, getMyVideos);
router.delete("/delete/:id", auth, deleteVideo);
router.get("/search", searchVideos);
export default router;
