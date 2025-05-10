import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const fetchProjects = () => axios.get(`${API}/api/projects`);

export const fetchPipelinesByProject = (project) =>
  axios.get(`${API}/api/pipelines/${project}`);

export const runPipeline = (url) =>
  axios.post(`${API}/api/run-pipeline`, { url });
