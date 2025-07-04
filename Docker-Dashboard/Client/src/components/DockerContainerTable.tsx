import type { Container } from "../types";
import { FaPlay, FaPause, FaTrash } from "react-icons/fa";

interface Props {
  containers: Container[];
  onAction: (id: string, action: string, name: string) => void;
}

export default function DockerContainerTable({ containers, onAction }: Props) {
  return (
    <div className="overflow-x-auto bg-[#1a1c2c]/90 border border-gray-700 rounded-xl shadow-xl p-6 backdrop-blur-md animate-fadeInUp">
      <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Active Docker Containers</h2>

      <table className="w-full table-auto text-sm text-left">
        <thead className="bg-[#2a2d45] text-gray-300 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Image</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((container, idx) => {
            const name = container.Names[0].replace("/", "");
            const isRunning = container.Status.startsWith("Up");
            const rowStyle = idx % 2 === 0 ? "bg-[#222437]" : "bg-[#1f2135]";

            return (
              <tr key={container.Id} className={`${rowStyle} hover:bg-[#2a2d45] transition`}>
                <td className="px-6 py-4 font-mono text-gray-400">{container.Id.slice(0, 12)}</td>
                <td className="px-6 py-4 font-medium text-white">{name}</td>
                <td className="px-6 py-4 text-gray-300">{container.Image}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      isRunning
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                    }`}
                  >
                    {isRunning ? "Running" : "Paused"}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2 justify-center flex-wrap">
                  {!isRunning ? (
                    <button
                      onClick={() => onAction(container.Id, "start", name)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded shadow transition"
                    >
                      <FaPlay size={12} /> Start
                    </button>
                  ) : (
                    <button
                      onClick={() => onAction(container.Id, "stop", name)}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black text-xs rounded shadow transition"
                    >
                      <FaPause size={12} /> Pause
                    </button>
                  )}
                  <button
                    onClick={() => onAction(container.Id, "delete", name)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded shadow transition"
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
