import { Video } from "../Models/Video.js";
import { Comment } from "../Models/commentModel.js";

export const createContent = async (req, res) => {
  try {
    const { title, description, category, thumbnailUrl, videoUrl } = req.body;
    const creator = req.user.id;

    if (!title || !category || !thumbnailUrl || !videoUrl) {
      return res.status(400).json({
        message: "all fields are required.",
        content: { title, category, thumbnailUrl, videoUrl, description },
      });
    }

    // Create video document
    const video = await Video.create({
      title,
      description,
      category,
      creator,
      thumbnailUrl,
      videoUrl,
    });

    return res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const skip = (page - 1) * limit;
    const videos = await Video.find()
      .populate("creator", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (videos.length === 0) {
      return res.status(404).json({
        message: "No videos found",
      });
    }

    const totalVideos = await Video.countDocuments();

    return res.status(200).json({
      message: "Videos fetched successfully",
      videos,
      totalVideos,
      currentPage: page,
      totalPages: Math.ceil(totalVideos / limit),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getSingleVideo = async (req, res) => {
  try {
    const videoId = req.params.id;

    const video = await Video.findById(videoId).populate("creator", "name");

    if (!video) {
      return res.status(404).json({
        message: "Video does not exist.",
      });
    }
    return res.status(200).json({
      message: "Video fetched successfully.",
      video,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({
      creator: req.user.id,
    })
      .populate("creator", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Your videos fetched successfully",
      videos,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const setViews = async (req, res) => {
  try {
    const videoId = req.params.id;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video does not exist.",
      });
    }

    video.views += 1;

    await video.save();

    return res.status(200).json({
      message: "View added successfully.",
      views: video.views,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const addLike = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const user = req.user.id;

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const alreadyLiked = video.likes.some(
      (id) => id.toString() === user.toString(),
    );

    if (alreadyLiked) {
      video.likes = video.likes.filter(
        (id) => id.toString() !== user.toString(),
      );

      await video.save();

      return res.status(200).json({
        message: "Video unliked",
        liked: false,
        likes: video.likes.length,
      });
    }

    video.likes.push(user);

    await video.save();

    return res.status(200).json({
      message: "Video liked",
      liked: true,
      likes: video.likes.length,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const user = req.user.id;
    const video = req.params.id;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty.",
      });
    }

    const comment = await Comment.create({
      text: text.trim(),
      user,
      video,
    });

    await comment.populate("user", "name avatar");

    return res.status(201).json({
      message: "Comment added successfully.",
      comment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.id })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      comments,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found.",
      });
    }

    // Only the creator can delete their video
    if (video.creator.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this video.",
      });
    }

    await Video.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Video deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//search

export const searchVideos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        message: "Search query is required.",
      });
    }

    const videos = await Video.find({
      title: { $regex: q.trim(), $options: "i" },
    })
      .populate("creator", "name avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Search results fetched successfully.",
      videos,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
