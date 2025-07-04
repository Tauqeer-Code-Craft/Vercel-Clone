import React from "react";
import { FaGithub } from "react-icons/fa";

export const GitHubLogin: React.FC = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-10 rounded-2xl bg-gradient-to-br from-[#0f111a] via-[#1a1c29] to-[#12131b] shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-700 overflow-hidden text-white group">
      {/* Background Glow */}
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 opacity-10 rounded-full blur-2xl animate-pulse z-0" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome to <span className="text-blue-400">T&A Board</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Import your GitHub projects, deploy in Docker, and manage everything from one dashboard.
          </p>

          <button
            onClick={handleLogin}
            className="mt-6 flex items-center gap-3 bg-black hover:bg-gray-900 border border-gray-700 hover:border-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none"
          >
            <FaGithub size={20} className="animate-bounce-slow" />
            <span>Sign in with GitHub</span>
          </button>

          <p className="text-xs text-gray-500 mt-4">
            No password required. We use GitHub OAuth to authenticate.
          </p>
        </div>
      </div>
    </div>
  );
};
