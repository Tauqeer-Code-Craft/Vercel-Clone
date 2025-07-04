import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import Navbar from "./components/Navbar";
import DockerContainerTable from "./components/DockerContainerTable";
import ImportedRepos from "./components/ImportedRepos";
import GitHubRepoModal from "./components/GitHubRepoModal";
import LandingScreen from "./components/LandingScreen";
import { GitHubLogin } from "./components/GitHubLogin";

import type { Container, GitHubUser, Repo } from "./types";
import FollowUs from "./components/FollowUs";

const App: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedRepos, setImportedRepos] = useState<Repo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [params] = useSearchParams();

  const fetchUser = async () => {
    try {
      const res = await axios.get<GitHubUser>(
        "http://localhost:5000/api/auth/me",
        {
          withCredentials: true,
        }
      );
      setUser(res.data);

      const imported = await axios.get<Repo[]>(
        `http://localhost:5000/api/imported-repos?userId=${res.data.githubId}`,
        { withCredentials: true }
      );
      setImportedRepos(imported.data || []);
    } catch {
      setUser(null);
    }
  };

  const fetchContainers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/container");
      setContainers(res.data.containers || []);
    } catch {
      setError("Failed to load containers");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      toast.success("Logged out successfully");
      window.location.href = "http://localhost:5173/";
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleContainerAction = async (
    id: string,
    action: string,
    name: string
  ) => {
    if (!user) return toast.error("Please login to perform actions");

    const actionMap: Record<string, string> = {
      start: "Starting",
      stop: "Pausing",
      delete: "Deleting",
    };

    toast(`${name} is ${actionMap[action] || action}`);
    try {
      const url = `http://localhost:8000/api/container/${id}${
        action === "delete" ? "" : `/${action}`
      }`;
      await (action === "delete" ? axios.delete(url) : axios.post(url));
      fetchContainers();
    } catch (err: any) {
      toast.error("Action failed: " + err.message);
    }
  };

  const handleHost = async (repo: Repo) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/container/deploy",
        {
          repoUrl: `https://github.com/${repo.owner?.login}/${repo.name}.git`,
          username: repo.owner?.login || "unknown",
        },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data?.containerId) {
        toast.success(`${repo.name} hosted successfully`);
        fetchContainers();
      } else {
        toast.success(`${repo.name} may be hosted`);
        console.warn("Unexpected deploy response", res.data);
        fetchContainers();
      }
    } catch (err: any) {
      console.error("Deploy failed:", err);
      toast.error(`Hosting failed for ${repo.name}`);
    }
  };

  useEffect(() => {
    if (params.get("login") === "success") fetchUser();
  }, [params]);

  useEffect(() => {
    fetchContainers();
  }, []);

  return (
    <div className="bg-black min-h-screen min-w-screen text-white font-sans">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="px-2 sm:px-8 py-10 max-w-6xl mx-auto">
        {loading && (
          <p className="text-center text-blue-400 text-lg font-medium">
            Loading...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 text-lg font-medium">
            {error}
          </p>
        )}

        {!user ? (
          <div className="flex flex-col lg:flex-row items-start justify-center gap-12 px-6 py-14 max-w-7xl mx-auto">
            <div className="flex-1 min-w-[320px]">
              <LandingScreen />
            </div>
            <div className="w-full max-w-sm flex flex-col items-center">
              <GitHubLogin />
              <FollowUs />
            </div>
          </div>
        ) : (
          <>
            <DockerContainerTable
              containers={containers}
              onAction={handleContainerAction}
            />

            <div className="mt-16">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">GitHub Projects</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium px-4 py-2 rounded shadow"
                >
                  Import Project
                </button>
              </div>

              <ImportedRepos
                importedRepos={importedRepos}
                onHost={handleHost}
              />
              <div className="mt-8 text-right">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}

        {showModal && user && (
          <GitHubRepoModal
            onClose={() => setShowModal(false)}
            importedRepos={importedRepos}
            setImportedRepos={setImportedRepos}
          />
        )}
      </main>
    </div>
  );
};

export default App;
