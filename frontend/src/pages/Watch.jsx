import { useEffect, useState, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Heart, Share2 } from "lucide-react";

const Watch = () => {
  const { id } = useParams();
  const [views, setViews] = useState();
  const [viewAdded, setViewAdded] = useState(false);
  const token = localStorage.getItem("token");

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  //video player states
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [previousVolume, setPreviousVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  //video player finish

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  //handleskip

  const handleSkip = (seconds) => {
    if (!videoRef.current) return;

    const newTime = Math.min(
      Math.max(videoRef.current.currentTime + seconds, 0),
      videoRef.current.duration,
    );

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleFullscreen = async () => {
    if (!playerRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await playerRef.current.requestFullscreen();
    }
  };

  const handleVolume = (e) => {
    const newVolume = e.target.value;

    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleMute = () => {
    if (isMuted) {
      videoRef.current.volume = previousVolume;
      setVolume(previousVolume);
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const showPlayerControls = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const setVideoView = async () => {
    if (viewAdded) return;
    try {
      const response = await axios.post(
        `https://hipnovivev2.onrender.com/video/view/${id}`,
      );

      setViews(response.data.views);
      setViewAdded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const [user, setUser] = useState(null);

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axios.get(
        "https://hipnovivev2.onrender.com/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const getVideo = async () => {
    try {
      const response = await axios.get(
        `https://hipnovivev2.onrender.com/video/single/${id}`,
      );

      const videoData = response.data.video;

      setVideo(videoData);
      setLikeCount(videoData.likes?.length || 0);

      if (user) {
        setLiked(
          videoData.likes?.some(
            (likeId) => likeId.toString() === user._id.toString(),
          ) || false,
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, [id]);

  useEffect(() => {
    getVideo();
    getComments();
  }, [id, user]);
  const handleLike = async () => {
    if (!token) {
      alert("Please login to like this video.");
      return;
    }
    try {
      const response = await axios.post(
        `https://hipnovivev2.onrender.com/video/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setLiked(response.data.liked);
      setLikeCount(response.data.likes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Video link copied!");
    } catch (error) {
      console.log(error);
    }
  };
  //comment system
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const handleComment = async () => {
    if (!token) {
      alert("Please login to comment.");
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    try {
      const response = await axios.post(
        `https://hipnovivev2.onrender.com/video/comment/${id}`,
        {
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);

      setCommentText("");
      setComments((prev) => [response.data.comment, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const response = await axios.get(
        `https://hipnovivev2.onrender.com/video/comments/${id}`,
      );

      setComments(response.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  //video container

  const [videoAspectRatio, setVideoAspectRatio] = useState("16 / 9");

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!video) {
    return <p className="p-6">Video not found</p>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Video */}
      <div
        ref={playerRef}
        onMouseMove={showPlayerControls}
        onTouchStart={showPlayerControls}
        style={{ aspectRatio: videoAspectRatio }}
        className="group relative w-full  overflow-hidden rounded bg-black shadow-lg"
      >
        <video
          src={video.videoUrl}
          ref={videoRef}
          className="h-full w-full object-contain"
          onPlay={setVideoView}
          onLoadedMetadata={() => {
            setDuration(videoRef.current.duration);
          }}
          onTimeUpdate={() => {
            setCurrentTime(videoRef.current.currentTime);
          }}
        />

        {/* Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "pointer-events-none opacity-0"
          } bg-gradient-to-t from-black/95 via-black/60 to-transparent px-2 pb-2 pt-6 sm:px-4 sm:pb-3 sm:pt-10`}
        >
          {/* Progress */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-8 text-[10px] font-medium text-white sm:w-10 sm:text-xs">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-violet-500 sm:h-1.5"
            />

            <span className="w-8 text-[10px] font-medium text-white sm:w-10 sm:text-xs">
              {formatTime(duration)}
            </span>
          </div>

          {/* Bottom controls */}
          <div className="mt-3 flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              {/* Backward 5 sec */}
              <button
                onClick={() => handleSkip(-5)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 sm:h-9 sm:w-9"
                aria-label="Back 5 seconds"
              >
                <RotateCcw size={19} />
              </button>

              {/* Forward 5 sec */}
              <button
                onClick={() => handleSkip(5)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 sm:h-9 sm:w-9"
                aria-label="Forward 5 seconds"
              >
                <RotateCw size={19} />
              </button>

              {/* Mute */}
              <button
                onClick={handleMute}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 sm:h-9 sm:w-9"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>

              {/* Volume - desktop only */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolume}
                className="hidden h-1 w-20 cursor-pointer accent-violet-500 sm:block"
              />
            </div>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 sm:h-9 sm:w-9"
              aria-label="Fullscreen"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-5 text-xl font-bold leading-7 text-zinc-900 sm:text-2xl">
        {video.title}
      </h1>

      {/* Creator + Actions */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Creator */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 font-semibold text-violet-700">
            {video.creator?.avatar ? (
              <img
                src={video.creator.avatar}
                alt={video.creator.name}
                className="h-full w-full object-cover"
              />
            ) : (
              video.creator?.name?.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <p className="font-semibold text-zinc-900">{video.creator?.name}</p>

            <p className="text-sm text-zinc-500">
              {views ?? video.views} views
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
              liked
                ? "bg-violet-100 text-violet-700"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />

            <span>{likeCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200"
          >
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mt-5 rounded-2xl bg-zinc-100 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <span>{views ?? video.views} views</span>
          <span>•</span>
          <span>{video.category}</span>
        </div>

        <p className="text-sm leading-6 text-zinc-700">
          {video.description || "No description available."}
        </p>
      </div>

      {/* Comments */}
      {/* Comments */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-zinc-900">Comments</h2>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-violet-500 sm:px-4 sm:py-3"
          />

          <button
            className="w-full rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 sm:w-auto sm:px-5 sm:py-3"
            onClick={handleComment}
          >
            Comment
          </button>
        </div>
      </div>

      {comments.length > 0 ? (
        <div className="mt-6 space-y-5">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                {comment.user?.avatar ? (
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  comment.user?.name?.charAt(0).toUpperCase()
                )}
              </div>

              {/* Comment content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm font-semibold text-zinc-900">
                    {comment.user?.name}
                  </p>

                  <span className="text-xs text-zinc-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-1.5 break-words text-sm leading-6 text-zinc-600">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-zinc-200 py-8 text-center">
          <p className="text-sm font-medium text-zinc-500">No comments yet</p>
          <p className="mt-1 text-xs text-zinc-400">
            Be the first to share your thoughts.
          </p>
        </div>
      )}
    </div>
  );
};

export default Watch;
