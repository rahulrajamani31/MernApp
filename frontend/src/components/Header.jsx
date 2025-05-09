import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-black text-white flex justify-between items-center px-6 py-3 shadow">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-8 w-8" />
        <span className="text-xl font-bold">GDC Automation</span>
      </div>
      <div className="flex items-center gap-12">
        <button
          onClick={() => navigate("/")}
          className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/all-pipeline")}
          className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200"
        >
          Pipelines
        </button>
        <button
          onClick={() => navigate("/addpipeline")}
          className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200"
        >
          Add Pipeline
        </button>
        <span className="text-sm">👤 Functional User</span>
      </div>
    </header>
  );
}

export default Header;