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

  // Fetch all project names on initial load
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/projects")
      .then((res) => setProjects(res.data.projects))
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  // Fetch pipelines hashmap when a project is selected
  useEffect(() => {
    if (selectedProject) {
      axios
        .get(`http://localhost:5000/api/pipelines/${selectedProject}`)
        .then((res) => {
          setPipelinesMap(res.data.pipelines);
          setSelectedPipeline(""); // Reset previous pipeline
          setPipelineUrl(""); // Reset URL display
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

    try {
      const res = await axios.post("http://localhost:5000/api/run-pipeline", {
        url: pipelineUrl, // Pass pipeline URL
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
      setShowModal(true);
    } catch (error) {
      setIsSuccess(false);
      setModalMessage(
        "There is an issue with the pipeline run. Please contact the automation team or GDC."
      );
      setShowModal(true);
      console.error(error);
    }
  };

  // Close Modal
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={!pipelineUrl}
        >
          Run Pipeline
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
              <h2 className="text-lg font-bold mb-4">{isSuccess ? "Success" : "Error"}</h2>
              <p>{modalMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
