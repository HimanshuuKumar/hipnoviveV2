import {
  Home,
  Compass,
  Bookmark,
  History,
  Settings,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Home", icon: Home, url: "/" },
  { name: "MContent", icon: Video, url: "/my-content" },
  { name: "Explore", icon: Compass, url: "/" },
  { name: "Saved", icon: Bookmark, url: "/" },
  { name: "History", icon: History, url: "/" },
  { name: "Settings", icon: Settings, url: "/" },
];

const Sidebar = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-white lg:block">
        <nav className="sticky top-16 px-4 py-6">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.url}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white lg:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.url}
                className="flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:text-violet-700"
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
