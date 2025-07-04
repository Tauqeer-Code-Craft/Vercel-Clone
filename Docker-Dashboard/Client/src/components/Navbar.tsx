import type { GitHubUser } from "../types";

interface Props {
  user: GitHubUser | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: Props) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700 shadow-md">
      <h1 className="text-xl sm:text-2xl font-bold text-white">🔰T&A Hosting</h1>

      {user && (
        <div className="flex items-center gap-4">
          <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border border-gray-700" />
          <span className="text-sm font-medium text-white">{user.username}</span>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
