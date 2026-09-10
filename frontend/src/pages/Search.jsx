import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ContentCard from "../components/ContentCard";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchVideos = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `https://hipnovivev2.onrender.com/video/search?q=${encodeURIComponent(query)}`,
      );

      setVideos(response.data.videos);
    } catch (error) {
      console.error(error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      searchVideos();
    }
  }, [query]);

  if (loading) {
    return <p>Searching...</p>;
  }

  return (
    <div className="px-1 py-2 sm:py-4 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">
        Search results for "{query}"
      </h1>

      {videos.length === 0 ? (
        <p className="text-zinc-500">No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <ContentCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
