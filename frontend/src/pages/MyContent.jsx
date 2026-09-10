import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getMyVideos = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:4000/video/my-content",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setVideos(response.data.videos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyVideos();
  }, []);

  const handleDelete = async (videoId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?",
    );

    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:4000/video/delete/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVideos((prev) => prev.filter((video) => video._id !== videoId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading your videos...</p>;
  }

  return (
    <div className="px-2 py-5 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
            My Content
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Manage the videos you've uploaded
          </p>
        </div>

        <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
          {videos.length} {videos.length === 1 ? "Video" : "Videos"}
        </div>
      </div>

      {/* Empty State */}
      {videos.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-2xl">
            🎬
          </div>

          <h2 className="text-lg font-semibold text-zinc-900">No videos yet</h2>

          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            You haven't uploaded any videos yet. Start creating and share your
            content with the community.
          </p>
        </div>
      ) : (
        /* Video Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video._id}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-zinc-100">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />

                {/* Category */}
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {video.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="line-clamp-2 min-h-[48px] text-base font-semibold leading-6 text-zinc-900">
                  {video.title}
                </h2>

                <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
                  <span className="text-xs text-zinc-500">Your video</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>

                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-violet-600 transition hover:bg-violet-50"
                      onClick={() => navigate(`/watch/${video._id}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContent;
