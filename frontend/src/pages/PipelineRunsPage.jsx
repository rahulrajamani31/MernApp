import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactFlow, { useNodesState, useEdgesState, Background, Controls, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [];
const initialEdges = [];

const PipelineRunsPage = () => {
  const [runDetails, setRunDetails] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const organization = "SHS-IT-PLE-GDC";
  const project = "SHS%20IT%20Test%20Service";
  const runId = "3778"; // Replace with actual run ID or fetch dynamically
  const fetchRunDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3000/api/pipeline-run-details?organization=${organization}&project=${project}&runId=${runId}`);
      setRunDetails(response.data);
      // Process the data to create nodes and edges for React Flow
      const newNodes = [];
      const newEdges = [];
      if (response.data?.stages) {
        response.data.stages.forEach((stage, index) => {
          newNodes.push({
            id: stage.name,
            data: { label: <div>{stage.name}<br />Status: {stage.state}<br />Result: {stage.result}</div> },
            position: { x: index * 300, y: 50 },
            type: 'default',
          });
          if (index > 0) {
            newEdges.push({
              id: `e${index}`,
              source: response.data.stages[index - 1].name,
              target: stage.name,
              markerEnd: {
                type: MarkerType.arrowclosed,
              },
            });
          }
        });
      }
      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      console.error("Error fetching run details:", err);
      setError("Failed to load pipeline run details.");
    } finally {
      setLoading(false);
    }
  }, [organization, project, runId, setNodes, setEdges]);

  useEffect(() => {
    if (organization && project && runId) {
      fetchRunDetails();
    }
  }, [fetchRunDetails, organization, project, runId]);

  if (loading) {
    return <div>Loading pipeline run details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!runDetails) {
    return <div>No pipeline run details available.</div>;
  }

  return (
    <div style={{ width: '100%', height: 500 }}>
      <h2>Pipeline Run Details (Run ID: {runId})</h2>
      <p>Overall Status: {runDetails.state}, Result: {runDetails.result}</p>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="top-right"
      >
        <Background />
        <Controls />
      </ReactFlow>
      {/* Display detailed test results or other information here */}
    </div>
  );
};

export default PipelineRunsPage;