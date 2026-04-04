import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0);

  const fetchCandidates = async () => {
    const res = await axios.get(
      "https://resume-backend-hfcm.onrender.com/candidates",
    );
    setCandidates(res.data);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleUpload = async () => {
    if (!file || !jobDescription) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    await axios.post(
      "https://resume-backend-hfcm.onrender.com/upload-resume/",
      formData,
    );

    setFile(null);
    setJobDescription("");
    fetchCandidates();
  };

  const updateStatus = async (filename, status) => {
    await axios.put("https://resume-backend-hfcm.onrender.com/update-status", {
      filename,
      status,
    });
    fetchCandidates();
  };

  const total = candidates.length;
  const shortlisted = candidates.filter(
    (c) => c.status === "shortlisted",
  ).length;
  const rejected = candidates.filter((c) => c.status === "rejected").length;

  const chartData = [
    { name: "Shortlisted", value: shortlisted },
    { name: "Rejected", value: rejected },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <span className="text-gray-400">HR Panel</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-center">
          <p className="text-gray-300">Total</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-green-500/20 backdrop-blur-md p-4 rounded-xl text-center">
          <p className="text-green-300">Shortlisted</p>
          <h2 className="text-2xl font-bold">{shortlisted}</h2>
        </div>

        <div className="bg-red-500/20 backdrop-blur-md p-4 rounded-xl text-center">
          <p className="text-red-300">Rejected</p>
          <h2 className="text-2xl font-bold">{rejected}</h2>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-6">
        <h2 className="mb-4 text-lg">Candidate Overview</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-6">
        <h2 className="mb-4 text-lg">Upload Resume</h2>

        <label className="flex items-center gap-3 mb-4">
          <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition">
            Choose File
          </span>

          <span className="text-gray-300 text-sm">
            {file ? file.name : "No file selected"}
          </span>

          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <textarea
          className="w-full bg-transparent border border-gray-600 p-3 rounded mb-3"
          placeholder="Enter job description..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
        <h2 className="mb-4 text-lg">Candidates</h2>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border border-gray-600 p-2 rounded w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="number"
            placeholder="Min Score"
            className="bg-transparent border border-gray-600 p-2 rounded w-1/4"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
          />
        </div>

        <table className="w-full text-gray-200">
          <thead>
            <tr className="bg-white/10">
              <th className="p-2">Filename</th>
              <th className="p-2">Skills</th>
              <th className="p-2">Score</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {candidates
              .filter(
                (c) =>
                  c.filename.toLowerCase().includes(search.toLowerCase()) &&
                  c.match_score >= minScore,
              )
              .map((c, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-700 hover:bg-white/5"
                >
                  <td className="p-2">{c.filename}</td>

                  <td className="p-2">{c.skills.join(", ")}</td>

                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded text-white ${
                        c.match_score >= 70
                          ? "bg-green-500"
                          : c.match_score >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {c.match_score}%
                    </span>
                  </td>

                  <td className="p-2">{c.status || "pending"}</td>

                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => updateStatus(c.filename, "shortlisted")}
                      className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                    >
                      Shortlist
                    </button>

                    <button
                      onClick={() => updateStatus(c.filename, "rejected")}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
