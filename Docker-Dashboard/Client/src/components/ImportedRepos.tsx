import type { Repo } from "../types";

interface Props {
  importedRepos: Repo[];
  onHost: (repo: Repo) => void;
}

export default function ImportedRepos({ importedRepos, onHost }: Props) {
  if (importedRepos.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No repositories imported yet. Click <strong>Import Project</strong> to get started.
      </p>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
      {importedRepos.map((repo) => (
        <div
          key={`${repo.owner?.login}/${repo.name}`}
          className="flex justify-between items-center bg-gray-800 p-3 rounded hover:bg-gray-700 transition"
        >
          <div className="flex flex-col">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium hover:underline"
            >
              {repo.name}
            </a>
            <span className="text-sm text-gray-400">
              {repo.private ? "🔒 Private" : "🌐 Public"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              {repo.html_url.replace("https://github.com/", "")}
            </span>
            <button
              onClick={() => onHost(repo)}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
            >
              Host
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
