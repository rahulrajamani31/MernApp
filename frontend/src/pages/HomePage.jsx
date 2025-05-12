import React, { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [pipelinesMap, setPipelinesMap] = useState({});
  const [selectedPipeline, setSelectedPipeline] = useState("");
  const [pipelineUrl, setPipelineUrl] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // 🔁 Loading state
  const apiurl = "https://gdcautomationapiservice.azurewebsites.net/";
  // Fetch all project names on initial load
  useEffect(() => {
    axios
      .get(apiurl+"/api/projects")
      .then((res) => setProjects(res.data.projects))
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  // Fetch pipelines hashmap when a project is selected
  useEffect(() => {
    if (selectedProject) {
      axios
        .get(`${apiurl}/api/pipelines/${selectedProject}`)
        .then((res) => {
          setPipelinesMap(res.data.pipelines);
          setSelectedPipeline("");
          setPipelineUrl("");
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

  const handleRun = async () => {
    if (!pipelineUrl) return;

    setIsLoading(true); // Start loading
    try {
      const res = await axios.post(apiurl+"/api/run-pipeline", {
        url: pipelineUrl,
      });

      if (res.status === 200) {
        setIsSuccess(true);
        setModalMessage("Pipeline triggered successfully on 'dev' branch!");
      } else {
        setIsSuccess(false);
        setModalMessage(
          "There is an issue with the pipeline run. Please contact the automation team or GDC."
        );
      }
    } catch (error) {
      setIsSuccess(false);
      setModalMessage(
        "There is an issue with the pipeline run. Please contact the automation team or GDC."
      );
      console.error(error);
    } finally {
      setIsLoading(false); // Stop loading
      setShowModal(true);  // Show modal after response
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
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
            <option key={project} value={project}>
              {project}
            </option>
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center min-w-[140px]"
          disabled={!pipelineUrl || isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Running...
            </>
          ) : (
            "Run Pipeline"
          )}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
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
    
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'gray' }}>
        <p style={{ fontSize: '1.2em', fontStyle: 'italic' }}>
          "Pipeline Run Live Logs Monitoring" feature is yet to be implemented.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
