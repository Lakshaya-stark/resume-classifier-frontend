import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [customJD, setCustomJD] = useState("");
  const [minScore, setMinScore] = useState(0);

  // ================= FETCH =================
  const fetchJobs = async () => {
    const res = await axios.get(`${API}/jobs`);
    setJobs(res.data);
  };

  const fetchCandidates = async () => {
    if (!selectedJob) return;

    const res = await axios.get(`${API}/candidates?job_id=${selectedJob}`);
    setCandidates(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [selectedJob]);

  // ================= UPLOAD =================
  const handleUpload = async () => {
    if (!file) {
      alert("Select file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    if (customJD) {
      formData.append("custom_jd", customJD);
    } else {
      if (!selectedJob) {
        alert("Select job or enter custom JD");
        return;
      }
      formData.append("job_id", selectedJob);
    }

    await axios.post(`${API}/upload-resume/`, formData);
    fetchCandidates();
  };

  // ================= STATUS =================
  const updateStatus = async (filename, status) => {
    await axios.put(`${API}/update-status`, { filename, status });

    setCandidates((prev) =>
      prev.map((c) => (c.filename === filename ? { ...c, status } : c)),
    );
  };

  // ================= DELETE =================
  const handleDelete = async (filename) => {
    const confirmDelete = window.confirm("Delete this resume?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/delete-candidate/${filename}`);

      setCandidates((prev) => prev.filter((c) => c.filename !== filename));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ================= FILTER =================
  const filteredCandidates = candidates.filter(
    (c) =>
      c.filename.toLowerCase().includes(search.toLowerCase()) &&
      c.match_score >= minScore,
  );

  // ================= ANALYTICS =================
  const shortlisted = candidates.filter(
    (c) => c.status === "shortlisted",
  ).length;

  const rejected = candidates.filter((c) => c.status === "rejected").length;

  const chartData = candidates.map((c) => ({
    name: c.filename.slice(0, 8),
    score: c.match_score,
  }));

  const pieData = [
    { name: "Shortlisted", value: shortlisted },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const selectedJobData = jobs.find((j) => j._id === selectedJob);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        AI Resume Screening System
      </h1>

      {/* ================= JOB + UPLOAD ================= */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <select
          className="w-full p-3 mb-4 rounded bg-gray-900 border"
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
        >
          <option value="">Select Job</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>

        {/* REQUIRED SKILLS */}
        {selectedJobData && (
          <div className="mb-4 text-sm">
            <span className="text-gray-400">Required Skills: </span>
            <span className="text-blue-400 font-semibold">
              {selectedJobData.skills.join(", ")}
            </span>
          </div>
        )}

        {/* FILE INPUT FIXED */}
        <input
          type="file"
          className="mb-4 bg-gray-700 p-2 rounded cursor-pointer"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <textarea
          placeholder="Or paste custom job description..."
          className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-600"
          onChange={(e) => setCustomJD(e.target.value)}
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
        >
          Upload
        </button>
      </div>

      {/* ================= FILTER ================= */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by filename..."
          className="p-2 rounded bg-gray-800 w-1/2"
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Score"
          className="p-2 rounded bg-gray-800"
          onChange={(e) => setMinScore(Number(e.target.value))}
        />
      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="mb-4">Scores</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="mb-4">Status Distribution</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="mb-4 text-xl">Candidates</h2>

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
            {filteredCandidates.map((c, i) => (
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

                  {/* 🔥 DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(c.filename)}
                    className="bg-red-800 hover:bg-red-900 px-2 py-1 rounded"
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
