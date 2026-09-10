const categories = [
  "All",
  "Technology",
  "Gaming",
  "Design",
  "Music",
  "Fitness",
  "Movies",
  "Education",
];

const FeedHeader = () => {
  return (
    <div className="mb-6 space-y-5">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="border-b-2 border-violet-600 pb-2 text-sm font-semibold text-violet-700">
            For You
          </button>

          <button className="pb-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900">
            Following
          </button>
        </div>

        <button className="hidden text-sm font-medium text-zinc-500 hover:text-zinc-900 sm:block">
          Latest ▾
        </button>
      </div>

      {/* Categories */}
      <div className="relative">
        {/* Categories */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pr-10">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                index === 0
                  ? "bg-violet-600 text-white"
                  : "bg-white text-zinc-600 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#FAF9FF] to-transparent" />
      </div>
    </div>
  );
};

export default FeedHeader;
