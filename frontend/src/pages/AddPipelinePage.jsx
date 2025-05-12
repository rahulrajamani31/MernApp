import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddPipelinePage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [pipelineName, setPipelineName] = useState("");
  const [pipelineUrl, setPipelineUrl] = useState("");
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const apiurl = "https://gdcautomationapiservice.azurewebsites.net/";

  useEffect(() => {
    axios
      .get(apiurl + "/api/projects")
      .then((res) => setProjects(res.data.projects))
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectNameToUse = showNewProjectInput ? newProjectName.trim() : selectedProject;

    if (!projectNameToUse) {
      alert("Please select an existing project or enter a new project name.");
      return;
    }

    axios
      .post(apiurl + "/api/pipelines", {
        projectName: projectNameToUse,
        pipelineName,
        pipelineUrl,
      })
      .then((res) => {
        setShowSuccessModal(true);
      })
      .catch((err) => {
        setErrorMessage(err.message || "Failed to add pipeline");
        setShowErrorModal(true);
      });

    setNewProjectName("");
    setShowNewProjectInput(false);
    setSelectedProject("");
    setPipelineName("");
    setPipelineUrl("");
  };

  const toggleNewProjectInput = () => {
    setShowNewProjectInput(!showNewProjectInput);
    setSelectedProject("");
  };

  const toggleExistingProjectSelect = () => {
    setShowNewProjectInput(!showNewProjectInput);
    setNewProjectName("");
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add Pipeline</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        {!showNewProjectInput && (
          <div>
            <label htmlFor="existingProject" className="block text-sm font-medium text-gray-700 mb-1">
              Select Existing Project
            </label>
            <select
              id="existingProject"
              className="border p-2 rounded w-full"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 mt-2 text-sm"
              onClick={toggleNewProjectInput}
            >
              Create New Project
            </button>
          </div>
        )}

        {showNewProjectInput && (
          <div>
            <label htmlFor="newProject" className="block text-sm font-medium text-gray-700 mb-1">
              New Project Name
            </label>
            <input
              id="newProject"
              className="border p-2 rounded w-full"
              type="text"
              placeholder="Enter new project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
            />
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 mt-2 text-sm"
              onClick={toggleExistingProjectSelect}
            >
              Select Existing Project
            </button>
          </div>
        )}

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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-bold mb-2 text-green-600">Success!</h2>
            <p className="mb-4">Pipeline added successfully.</p>
            <button
              onClick={closeSuccessModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-bold mb-2 text-red-600">Error!</h2>
            <p className="mb-4">{errorMessage}</p>
            <button
              onClick={closeErrorModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
            <ul>
              <li><b>ORGANIZATION</b>- eg : SHS-IT-PLE-GDC</li>
              <li><b>PROJECT</b> - eg : SHS%20IT%20Test%20Service</li>
              <li><b>PIPELINE ID</b> -eg : 29</li>
            </ul>
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