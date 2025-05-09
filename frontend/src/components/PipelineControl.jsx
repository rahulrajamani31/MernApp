import { useState, useEffect } from 'react';

export default function PipelineControl({ onRun }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState('');

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(setProjects);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetch(`/api/pipelines/${selectedProject}`)
        .then(res => res.json())
        .then(setPipelines);
    }
  }, [selectedProject]);

  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded shadow">
      <select
        className="border rounded p-2"
        value={selectedProject}
        onChange={e => {
          setSelectedProject(e.target.value);
          setSelectedPipeline('');
        }}
      >
        <option value="">Select Project</option>
        {projects.map(p => (
          <option key={p.id} value={p.name}>{p.name}</option>
        ))}
      </select>

      <select
        className="border rounded p-2"
        value={selectedPipeline}
        onChange={e => setSelectedPipeline(e.target.value)}
        disabled={!selectedProject}
      >
        <option value="">Select Pipeline</option>
        {pipelines.map(pl => (
          <option key={pl.id} value={pl.id}>{pl.name}</option>
        ))}
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        onClick={() => onRun(selectedProject, selectedPipeline)}
        disabled={!selectedProject || !selectedPipeline}
      >
        Run
      </button>
    </div>
  );
}