import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AllPipelinesPage() {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [pipelineToDelete, setPipelineToDelete] = useState(null);
  const apiurl = "https://gdcautomationapiservice.azurewebsites.net/"; 

  useEffect(() => {
    fetchPipelines();
  }, []);

  const fetchPipelines = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiurl}/api/all-pipelines`);
      setPipelines(response.data.pipelines);
    } catch (err) {
      setError(err.message || 'Failed to load pipelines');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditData({
      projectName: item.projectName,
      oldPipelineName: item.pipelineName,
      pipelineName: item.pipelineName,
      url: item.url,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editData?.projectName || !editData?.oldPipelineName || !editData?.pipelineName || !editData?.url) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${apiurl}/api/pipelines`, {
        projectName: editData.projectName,
        oldPipelineName: editData.oldPipelineName,
        pipelineName: editData.pipelineName,
        pipelineUrl: editData.url,
      });
      setPipelines(pipelines.map(pipeline =>
        pipeline.projectName === editData.projectName && pipeline.pipelineName === editData.oldPipelineName
          ? { ...pipeline, pipelineName: editData.pipelineName, url: editData.url }
          : pipeline
      ));
      setShowEditModal(false);
    } catch (err) {
      setError(err.message || 'Failed to update pipeline');
      alert('Failed to update pipeline');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    setPipelineToDelete(item);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!pipelineToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`${apiurl}/api/pipelines`, {
        data: { projectName: pipelineToDelete.projectName, pipelineName: pipelineToDelete.pipelineName },
      });
      setPipelines(pipelines.filter(
        pipeline => !(pipeline.projectName === pipelineToDelete.projectName && pipeline.pipelineName === pipelineToDelete.pipelineName)
      ));
      setShowDeleteConfirmation(false);
      setPipelineToDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete pipeline');
      alert('Failed to delete pipeline');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setPipelineToDelete(null);
  };

  if (loading) {
    return <div>Loading pipelines...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Pipelines</h2>
      <Link to="/addpipeline" className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
        Add New Pipeline
      </Link>
      {pipelines.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Project Name</th>
                <th className="border border-gray-300 p-2 text-left">Pipeline Name</th>
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pipelines.map((pipeline) => (
                <tr key={`${pipeline.projectName}-${pipeline.pipelineName}`}>
                  <td className="border border-gray-300 p-2">{pipeline.projectName}</td>
                  <td className="border border-gray-300 p-2">{pipeline.pipelineName}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(pipeline)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pipeline)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No pipelines found.</p>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Pipeline</h2>
            <form onSubmit={handleEditSave} className="flex flex-col gap-4">
              <div>
                <label htmlFor="editProjectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  id="editProjectName"
                  className="border p-2 rounded w-full"
                  value={editData?.projectName || ''}
                  onChange={handleEditChange}
                  name="projectName"
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="editPipelineName" className="block text-sm font-medium text-gray-700 mb-1">
                  Pipeline Name
                </label>
                <input
                  type="text"
                  id="editPipelineName"
                  className="border p-2 rounded w-full"
                  value={editData?.pipelineName || ''}
                  onChange={handleEditChange}
                  name="pipelineName"
                  required
                />
              </div>
              <div>
                <label htmlFor="editUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Pipeline URL
                </label>
                <input
                  type="url"
                  id="editUrl"
                  className="border p-2 rounded w-full"
                  value={editData?.url || ''}
                  onChange={handleEditChange}
                  name="url"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4 text-gray-800">
              Are you sure you want to delete pipeline "{pipelineToDelete?.pipelineName}" from project "{pipelineToDelete?.projectName}"?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllPipelinesPage;