import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowDropdown(false);
    navigate("/");
  };

  const handleLogin = () => {
    setShowDropdown(false);
    navigate("/login");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Main Header */}
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            {/* Logo */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 font-bold text-white">
              H
            </div>

            {/* Name: hidden on phone */}
            <span className="hidden text-xl font-bold text-zinc-900 md:block">
              Hipnovive
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden flex-1 justify-center md:flex">
            <div className="flex w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="min-w-0 flex-1 rounded-l-full border border-r-0 border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none focus:border-violet-500"
              />

              <button
                onClick={handleSearch}
                className="flex w-12 items-center justify-center rounded-r-full border border-zinc-200 bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200"
              >
                <Search size={19} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowMobileSearch((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 md:hidden"
            >
              <Search size={20} />
            </button>
            {/* Create */}
            <Link
              to="/upload"
              className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-700 sm:px-4"
            >
              <span>Create</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex h-10 items-center gap-1 rounded-lg p-1 transition hover:bg-zinc-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
                  H
                </div>

                <ChevronDown
                  size={16}
                  className="hidden text-zinc-500 sm:block"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
                  {token && (
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                    >
                      Profile
                    </Link>
                  )}

                  {token ? (
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="px-4 pb-3 sm:px-6 md:hidden">
            <div className="flex w-full">
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                    setShowMobileSearch(false);
                  }
                }}
                className="min-w-0 flex-1 rounded-l-full border border-r-0 border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none focus:border-violet-500"
              />

              <button
                onClick={() => {
                  handleSearch();
                  setShowMobileSearch(false);
                }}
                className="flex w-12 items-center justify-center rounded-r-full border border-zinc-200 bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200"
              >
                <Search size={19} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
