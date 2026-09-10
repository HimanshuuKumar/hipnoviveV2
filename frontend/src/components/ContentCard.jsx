import { useNavigate } from "react-router-dom";

const ContentCard = ({ video }) => {
  const navigate = useNavigate();

  const getTimeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  return (
    <article
      className="w-full cursor-pointer "
      onClick={() => navigate(`/watch/${video._id}`)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-200 sm:rounded">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover"
          decoding="async"
        />
      </div>

      {/* Content Info */}
      <div className="mt-2 flex gap-3 px-1">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
          {video.creator?.name?.charAt(0).toUpperCase()}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-zinc-900">
            {video.title}
          </h3>

          <p className="mt-1 text-sm text-zinc-500">{video.creator?.name}</p>

          <p className="mt-1 text-xs text-zinc-400">
            {video.views} views • {getTimeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ContentCard;
