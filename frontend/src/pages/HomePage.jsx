import React, { useEffect, useState } from "react";
import {
  fetchProjects,
  fetchPipelinesByProject,
  runPipeline,
} from "../api/api";

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [pipelinesMap, setPipelinesMap] = useState({});
  const [selectedPipeline, setSelectedPipeline] = useState("");
  const [pipelineUrl, setPipelineUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => 
    {
    fetchProjects()
      .then((res) => setProjects(res.data.projects))
      .catch((err) => console.error("Error loading projects:", err));
  },[]);

  useEffect(() => {
    if (!selectedProject) return;

    fetchPipelinesByProject(selectedProject)
      .then((res) => {
        setPipelinesMap(res.data.pipelines);
        setSelectedPipeline("");
        setPipelineUrl("");
      })
      .catch((err) => console.error("Error loading pipelines:", err));
  }, [selectedProject]);

  useEffect(() => {
    if (selectedPipeline && pipelinesMap[selectedPipeline]) {
      setPipelineUrl(pipelinesMap[selectedPipeline]);
    } else {
      setPipelineUrl("");
    }
  }, [selectedPipeline, pipelinesMap]);

  const handleRun = async () => {
    if (!pipelineUrl) return;

    setIsLoading(true);

    try {
      const res = await runPipeline(pipelineUrl);

      setIsSuccess(res.status === 200);
      setModalMessage(
        res.status === 200
          ? "Pipeline triggered successfully on 'dev' branch!"
          : "There is an issue with the pipeline run. Please contact the automation team or GDC."
      );
    } catch (error) {
      setIsSuccess(false);
      setModalMessage(
        "There is an issue with the pipeline run. Please contact the automation team or GDC."
      );
      console.error(error);
    }

    setIsLoading(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center mb-4">
        <select
          className="border p-2 rounded"
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
        <button
          onClick={handleRun}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 min-w-[140px]"
          disabled={!pipelineUrl || isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            "Run Pipeline"
          )}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 text-xl"
            >
              ×
            </button>
            <div
              className={`${
                isSuccess ? "text-green-500" : "text-red-500"
              } text-center`}
            >
              <h2 className="text-lg font-bold mb-4">
                {isSuccess ? "Success" : "Error"}
              </h2>
              <p>{modalMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
