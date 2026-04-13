import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCandidates = async () => {
    const res = await axios.get(`${API}/candidates`);
    setCandidates(res.data);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (filename) => {
    if (!window.confirm("Delete this resume?")) return;

    await axios.delete(`${API}/delete-candidate/${filename}`);

    setCandidates((prev) => prev.filter((c) => c.filename !== filename));
  };

  // ================= STATUS =================
  const updateStatus = async (filename, status) => {
    await axios.put(`${API}/update-status`, { filename, status });

    setCandidates((prev) =>
      prev.map((c) => (c.filename === filename ? { ...c, status } : c)),
    );
  };

  const filtered = candidates.filter((c) =>
    c.filename.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8 text-white bg-gradient-to-br from-gray-900 to-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">All Candidates</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search candidates..."
        className="p-2 mb-6 w-full rounded bg-gray-800"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="p-2">Filename</th>
              <th>Skills</th>
              <th>Score</th>
              <th>Status</th>
              <th>Resume</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c, i) => (
              <tr key={i} className="border-b border-gray-700">
                <td className="p-2">{c.filename}</td>

                <td>{c.skills.join(", ")}</td>

                <td>
                  <span className="bg-blue-600 px-2 py-1 rounded">
                    {c.match_score}%
                  </span>
                </td>

                <td>{c.status || "pending"}</td>

                <td>
                  <a
                    href={`${API}/${c.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline"
                  >
                    View
                  </a>
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => updateStatus(c.filename, "shortlisted")}
                    className="bg-green-600 px-2 py-1 rounded"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() => updateStatus(c.filename, "rejected")}
                    className="bg-red-600 px-2 py-1 rounded"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleDelete(c.filename)}
                    className="bg-red-800 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
