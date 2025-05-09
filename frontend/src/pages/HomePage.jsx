import React, { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [pipelinesMap, setPipelinesMap] = useState({});
  const [selectedPipeline, setSelectedPipeline] = useState("");
  const [pipelineUrl, setPipelineUrl] = useState("");

  // Fetch all project names on initial load
  useEffect(() => {
    axios.get("http://localhost:5000/api/projects")
      .then((res) => setProjects(res.data.projects))
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  // Fetch pipelines hashmap when a project is selected
  useEffect(() => {
    if (selectedProject) {
      axios.get(`http://localhost:5000/api/pipelines/${selectedProject}`)
        .then((res) => {
          setPipelinesMap(res.data.pipelines);
          setSelectedPipeline(""); // Reset previous pipeline
          setPipelineUrl("");      // Reset URL display
        })
        .catch((err) => console.error("Error loading pipelines:", err));
    }
  }, [selectedProject]);

  // Set URL when a pipeline is selected
  useEffect(() => {
    if (selectedPipeline && pipelinesMap[selectedPipeline]) {
      setPipelineUrl(pipelinesMap[selectedPipeline]);
    } else {
      setPipelineUrl("");
    }
  }, [selectedPipeline, pipelinesMap]);

  const handleRun = () => {
    if (pipelineUrl) {
      window.open(pipelineUrl, "_blank");
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center mb-4">
        {/* Project Dropdown */}
        <select
          className="border p-2 rounded"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>

        {/* Pipeline Dropdown */}
        <select
          className="border p-2 rounded"
          value={selectedPipeline}
          onChange={(e) => setSelectedPipeline(e.target.value)}
          disabled={!selectedProject}
        >
          <option value="">Select Pipeline</option>
          {Object.keys(pipelinesMap).map((pipelineName) => (
            <option key={pipelineName} value={pipelineName}>
              {pipelineName}
            </option>
          ))}
        </select>

        {/* Run Button */}
        <button
          onClick={handleRun}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={!pipelineUrl}
        >
          Run Pipeline
        </button>
      </div>

      {/* Display URL (Optional for user clarity) */}
      {pipelineUrl && (
        <div className="text-sm text-gray-600 mt-2">
          Pipeline URL: <a href={pipelineUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{pipelineUrl}</a>
        </div>
      )}
    </div>
  );
}

export default HomePage;
