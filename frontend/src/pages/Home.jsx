import { useEffect, useRef, useState } from "react";
import axios from "axios";
import FeedHeader from "../components/FeedHeader";
import ContentCard from "../components/ContentCard";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadMoreRef = useRef(null);

  const getVideos = async () => {
    try {
      if (page > 1) {
        setLoadingMore(true);
      }

      const response = await axios.get(
        `https://hipnovivev2.onrender.com/video/get?page=${page}`,
      );
      setVideos((prev) => {
        const existingIds = new Set(prev.map((video) => video._id));

        const newVideos = response.data.videos.filter(
          (video) => !existingIds.has(video._id),
        );

        return [...prev, ...newVideos];
      });

      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);

      if (page > 1) {
        setPage((prev) => prev - 1);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getVideos();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 1,
      },
    );

    const currentRef = loadMoreRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [page, totalPages, loadingMore]);

  if (loading) {
    return <p>Loading videos...</p>;
  }

  return (
    <>
      <FeedHeader />

      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <ContentCard key={video._id} video={video} />
        ))}
      </div>

      {page < totalPages && (
        <div
          ref={loadMoreRef}
          className="flex h-20 items-center justify-center"
        >
          {loadingMore && (
            <p className="text-sm text-zinc-500">Loading more videos...</p>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
