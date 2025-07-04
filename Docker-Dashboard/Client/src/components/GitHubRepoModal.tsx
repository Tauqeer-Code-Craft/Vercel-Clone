import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaGithub, FaDocker } from "react-icons/fa";
import type { Repo, Props } from "../types";

const GitHubRepoModal: React.FC<Props> = ({ onClose, importedRepos, setImportedRepos }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const [logs, setLogs] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/github/repos", {
          withCredentials: true,
        });
        setRepos(res.data);
      } catch (err) {
        console.error("Error fetching repos", err);
        toast.error("Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  const handleImport = async (repo: Repo) => {
    if (importedRepos.find((r) => r.id === repo.id)) return;

    setStatusMap((prev) => ({ ...prev, [repo.id]: "importing" }));
    try {
      await axios.post(
        "http://localhost:5000/api/github/webhooks",
        { repoOwner: repo.owner?.login, repoName: repo.name },
        { withCredentials: true }
      );

      await axios.post(
      "http://localhost:5000/api/imported-repos",
      {
        userId: repo.owner?.id,
        repo,
      },
      { withCredentials: true }
    );
      setImportedRepos((prev) => [...prev, repo]);
      setStatusMap((prev) => ({ ...prev, [repo.id]: "imported" }));
      toast.success(`${repo.name} imported`);
    } catch (error) {
      console.error(error);
      setStatusMap((prev) => ({ ...prev, [repo.id]: "error" }));
      toast.error(`Failed to import ${repo.name}`);
    }
  };

  const handleHost = async (repo: Repo) => {
    setStatusMap((prev) => ({ ...prev, [repo.id]: "deploying" }));
    try {
      const res = await fetch("http://localhost:8000/api/container/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          repoUrl: `https://github.com/${repo.owner?.login}/${repo.name}.git`,
          username: repo.owner?.login || "unknown",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to deploy");

      setStatusMap((prev) => ({ ...prev, [repo.id]: "hosted" }));
      setLogs((prev) => ({
        ...prev,
        [repo.id]: `Deployment started for ${repo.name}. Logs: ${data.message || "Check your dashboard."}`,
      }));
      toast.success(`${repo.name} hosted successfully`);
    } catch (error: any) {
      console.error(error);
      setStatusMap((prev) => ({ ...prev, [repo.id]: "error" }));
      setLogs((prev) => ({
        ...prev,
        [repo.id]: error.message || "Unknown error occurred",
      }));
      toast.error(`Hosting failed for ${repo.name}`);
    }
  };

  const handleImportAll = async () => {
    const unimported = repos.filter(
      (repo) => !importedRepos.some((r) => r.id === repo.id)
    );
    if (unimported.length === 0) {
      toast("All repos already imported");
      return;
    }

    for (const repo of unimported) {
      await handleImport(repo);
    }
  };

  const handleRemove = (repoId: number) => {
    setImportedRepos((prev) => prev.filter((r) => r.id !== repoId));
    setStatusMap((prev) => ({ ...prev, [repoId]: "idle" }));
    toast("Repo removed");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#0d1117] text-white rounded-lg w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white"
        >
          &times;
        </button>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FaGithub className="text-2xl" />
            <h2 className="text-2xl font-semibold">Manage GitHub Repositories</h2>
          </div>
          <button
            onClick={handleImportAll}
            className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded text-sm font-medium"
          >
            Import All
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Fetching repositories...</p>
        ) : (
          <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {repos.map((repo) => {
              const isImported = importedRepos.some((r) => r.id === repo.id);
              const status = statusMap[repo.id] || (isImported ? "imported" : "idle");

              return (
                <li key={repo.id} className="bg-gray-800 p-4 rounded-md space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium hover:underline"
                      >
                        {repo.name}
                      </a>
                      <p className="text-xs text-gray-400">
                        {repo.private ? "🔒 Private" : "🌐 Public"}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {status === "idle" && (
                        <button
                          onClick={() => handleImport(repo)}
                          className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                        >
                          Import
                        </button>
                      )}
                      {status === "importing" && (
                        <button disabled className="bg-gray-500 px-3 py-1 rounded">
                          Importing...
                        </button>
                      )}
                      {status === "imported" && (
                        <>
                          <button
                            onClick={() => handleHost(repo)}
                            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                          >
                            <FaDocker /> Host
                          </button>
                          <button
                            onClick={() => handleRemove(repo.id)}
                            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </>
                      )}
                      {status === "deploying" && (
                        <button disabled className="bg-yellow-500 text-black px-3 py-1 rounded">
                          Deploying...
                        </button>
                      )}
                      {status === "hosted" && (
                        <span className="bg-green-700 px-3 py-1 rounded text-sm">Hosted</span>
                      )}
                      {status === "error" && (
                        <span className="text-sm text-red-400">Error</span>
                      )}
                    </div>
                  </div>

                  {logs[repo.id] && (
                    <pre className="bg-black/30 p-2 text-xs rounded max-h-40 overflow-y-auto whitespace-pre-wrap">
                      {logs[repo.id]}
                    </pre>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GitHubRepoModal;
