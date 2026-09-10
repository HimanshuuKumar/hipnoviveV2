import { useState } from "react";
import axios from "axios";

const UploadContent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  //upload mesaure

  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadVideoToCloudinary = async (onProgress) => {
    const cloudName = "ds72doagd";
    const uploadPreset = "hipnovive_upload";

    const tenMB = 10 * 1024 * 1024;

    // --------------------------------
    // SMALL VIDEO: LESS THAN 10 MB
    // --------------------------------
    if (video.size < tenMB) {
      const formData = new FormData();

      formData.append("file", video);
      formData.append("upload_preset", uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100,
              );

              onProgress(progress);
            }
          },
        },
      );

      return response.data.secure_url;
    }

    // --------------------------------
    // LARGE VIDEO: 10 MB OR MORE
    // --------------------------------

    const chunkSize = 10 * 1024 * 1024;
    const uniqueUploadId = crypto.randomUUID();

    let start = 0;
    let secureUrl = "";

    while (start < video.size) {
      const end = Math.min(start + chunkSize, video.size);

      const chunk = video.slice(start, end);

      const formData = new FormData();

      formData.append("file", chunk);
      formData.append("upload_preset", uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData,
        {
          headers: {
            "X-Unique-Upload-Id": uniqueUploadId,
            "Content-Range": `bytes ${start}-${end - 1}/${video.size}`,
          },
        },
      );

      start = end;

      const progress = Math.round((start / video.size) * 100);

      onProgress(progress);

      console.log("Chunk uploaded:", progress + "%");

      if (response.data.secure_url) {
        secureUrl = response.data.secure_url;
      }
    }

    if (!secureUrl) {
      throw new Error("Cloudinary did not return video URL.");
    }

    return secureUrl;
  };
  const uploadThumbnailToCloudinary = async () => {
    const formData = new FormData();

    formData.append("file", thumbnail);
    formData.append("upload_preset", "hipnovive_upload");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/ds72doagd/image/upload",
      formData,
    );

    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !thumbnail || !video) {
      return alert("please complete all fields.");
    }

    try {
      setLoading(true);

      const videoUrl = await uploadVideoToCloudinary((progress) => {
        setUploadProgress(progress);
      });

      const thumbnailUrl = await uploadThumbnailToCloudinary();
      const res = await axios.post(
        "https://hipnovivev2.onrender.com/video/create",
        {
          title,
          description,
          category,
          thumbnailUrl,
          videoUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);

      setTitle("");
      setDescription("");
      setCategory("");
      alert("video uploaded successfully");
    } catch (error) {
      console.error("Cloudinary error:", error);
      console.error("Response:", error.response?.data);

      alert(
        error.response?.data?.error?.message ||
          "Something went wrong while uploading",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const maxSize = 100 * 1024 * 1024;

    if (file.size >= maxSize) {
      alert("Video must be less than 100 MB.");
      e.target.value = "";
      return;
    }

    setVideo(file);
  };
  return (
    <div className="mx-auto max-w-2xl p-2 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Upload Content</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium">Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 sm:px-4 sm:py-3 outline-none focus:border-violet-500"
          />
        </div>
        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            rows="5"
            className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 sm:px-4 sm:py-3 outline-none focus:border-violet-500"
          />
        </div>
        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 sm:px-4 sm:py-3 outline-none focus:border-violet-500"
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="gaming">Gaming</option>
            <option value="design">Design</option>
            <option value="music">Music</option>
            <option value="fitness">Fitness</option>
            <option value="movies">Movies</option>
            <option value="education">Education</option>
          </select>
        </div>
        {/* Thumbnail */}
        <div>
          <label className="mb-2 block text-sm font-medium">Thumbnail</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full rounded-lg border border-zinc-300 p-2"
          />
        </div>
        {/* Video */}
        <div>
          <label className="mb-2 block text-sm font-medium">Video</label>

          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full rounded-lg border border-zinc-300 p-2"
          />
        </div>
        {/* Submit */}

        {loading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-zinc-700">
                Uploading video...
              </span>
              <span className="font-semibold text-violet-600">
                {uploadProgress}%
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload Content"}
        </button>
      </form>
    </div>
  );
};

export default UploadContent;
