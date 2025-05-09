import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddPipelinePage() {
  const [projectName, setProjectName] = useState("");
  const [pipelineName, setPipelineName] = useState("");
  const [pipelineUrl, setPipelineUrl] = useState("");
  const navigate = useNavigate(); // 👈 added

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/pipelines", {
      projectName,
      pipelineName,
      pipelineUrl,
    })
      .then((res) => {
        alert("Pipeline added successfully");
        // 👇 Navigate to home page
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add Pipeline</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Pipeline Name"
          value={pipelineName}
          onChange={(e) => setPipelineName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="url"
          placeholder="Pipeline URL"
          value={pipelineUrl}
          onChange={(e) => setPipelineUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Pipeline
        </button>
      </form>
    </div>
  );
}

export default AddPipelinePage;
