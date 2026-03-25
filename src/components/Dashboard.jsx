import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Upload resume
  const handleUpload = async () => {
    if (!file || !jobDescription) {
      alert("Please provide file and job description");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      await axios.post("http://127.0.0.1:8000/upload-resume/", formData);
      alert("Uploaded successfully");

      setFile(null);
      setJobDescription("");

      fetchCandidates(); // refresh
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  };

  // Update status
  const updateStatus = async (filename, status) => {
    try {
      await axios.put("http://127.0.0.1:8000/update-status", {
        filename,
        status,
      });

      fetchCandidates(); // refresh
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // Score color
  const getScoreColor = (score) => {
    if (score >= 70) return "green";
    if (score >= 50) return "orange";
    return "red";
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Upload Section */}
      <h2>Upload Resume</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <br />
      <br />

      <textarea
        placeholder="Enter job description"
        rows="4"
        cols="50"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleUpload}>Upload</button>

      <hr />

      {/* Candidates Table */}
      <h2>Candidates</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Skills</th>
            <th>Score</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((c, index) => (
            <tr key={index}>
              <td>{c.filename}</td>

              <td>{c.skills.join(", ")}</td>

              <td style={{ color: getScoreColor(c.match_score) }}>
                {c.match_score}%
              </td>

              <td>{c.status || "pending"}</td>

              <td>
                <button
                  onClick={() => updateStatus(c.filename, "shortlisted")}
                  style={{ marginRight: "10px" }}
                >
                  ✅ Shortlist
                </button>

                <button onClick={() => updateStatus(c.filename, "rejected")}>
                  ❌ Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
