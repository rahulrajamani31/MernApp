import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddPipelinePage() {
  const [projectName, setProjectName] = useState("");
  const [pipelineName, setPipelineName] = useState("");
  const [pipelineUrl, setPipelineUrl] = useState("");
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://gdcautomationapiservice.azurewebsites.net/api/pipelines", {
        projectName,
        pipelineName,
        pipelineUrl,
      })
      .then((res) => {
        alert("Pipeline added successfully");
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

      {/* Recommendation Section */}
      <div className="mt-6 text-sm bg-yellow-100 text-yellow-800 p-4 rounded border border-yellow-300">
        <strong>ℹ️ Note for adding Pipeline URL:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>
            The URL should point directly to the Azure DevOps pipeline run endpoint.
          </li>
          <li>
            Make sure the URL starts with <code>https://dev.azure.com/</code>
          </li>
          <li>
            It should include 
              <li><b>ORGANIZATION</b>- eg : SHS-IT-PLE-GDC</li> 
              <li><b>PROJECT</b> - eg : SHS%20IT%20Test%20Service</li>
              <li><b>PIPELINE ID</b> -eg : 29</li>
          </li>
          <li>
            Example:{" "}
            <code>
              https://dev.azure.com/ORGANIZATION/PROJECT/_apis/pipelines/PIPLINE ID/runs?api-version=7.0
            </code>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AddPipelinePage;
