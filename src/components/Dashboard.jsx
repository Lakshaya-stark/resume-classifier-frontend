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

  // 🔥 Handle upload
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

      fetchCandidates(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
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

      <h2>Candidates</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Skills</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((c, index) => (
            <tr key={index}>
              <td>{c.filename}</td>
              <td>{c.skills.join(", ")}</td>
              <td>{c.match_score}%</td>
              <td>{c.status || "pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
