import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const fetchCandidates = async () => {
    const res = await axios.get("http://127.0.0.1:8000/candidates");
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

    await axios.post("http://127.0.0.1:8000/upload-resume/", formData);

    setFile(null);
    setJobDescription("");
    fetchCandidates();
  };

  const updateStatus = async (filename, status) => {
    await axios.put("http://127.0.0.1:8000/update-status", {
      filename,
      status,
    });
    fetchCandidates();
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <span className="text-gray-500">HR Panel</span>
      </div>

      {/* Upload Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>

        <input
          type="file"
          className="mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <textarea
          className="w-full border p-3 rounded-lg mb-3"
          placeholder="Enter job description..."
          rows="4"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </div>

      {/* Candidates Table */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Candidates</h2>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2">Filename</th>
              <th className="p-2">Skills</th>
              <th className="p-2">Score</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((c, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="p-2">{c.filename}</td>

                <td className="p-2">{c.skills.join(", ")}</td>

                <td className="p-2">
                  <span
                    className={`text-white px-3 py-1 rounded ${
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

                <td className="p-2">
                  <span className="px-2 py-1 bg-gray-200 rounded">
                    {c.status || "pending"}
                  </span>
                </td>

                <td className="p-2 space-x-2">
                  <button
                    onClick={() => updateStatus(c.filename, "shortlisted")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() => updateStatus(c.filename, "rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
