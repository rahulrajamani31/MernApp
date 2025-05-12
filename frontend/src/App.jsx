import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddPipelinePage from "./pages/AddPipelinePage";
import Header from "./components/Header";
import AllPipelinesPage from "./pages/AllPipelinesPage";
import PipelineRunsPage from "./pages/PipelineRunsPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/addpipeline" element={<AddPipelinePage />} />
        <Route path="/all-pipeline" element={<AllPipelinesPage />} />
        <Route path="/logs" element={<PipelineRunsPage />} />
      </Routes>
    </Router>
  );
}

export default App;