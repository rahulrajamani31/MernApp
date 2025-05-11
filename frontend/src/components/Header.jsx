import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-black text-white flex justify-between items-center px-6 py-3 shadow">
      {/* Logo and Name - clickable to navigate home */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 cursor-pointer"
        title="Go to Home"
      >
        <div className="bg-white rounded-full p-1">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
        </div>
        <span className="text-2xl font-bold">GDC Automation</span>
      </div>

      {/* Navigation Buttons */}
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
