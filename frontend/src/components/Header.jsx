import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getActiveStyle = (path) => {
    return isActive(path)
      ? "text-blue-500 font-semibold after:w-full" // Highlighted text and full underline
      : "hover:text-blue-300 hover:after:w-full"; // Hover effect
  };

  return (
    <header className="bg-black text-white flex justify-between items-center px-6 py-3 shadow">
      {/* Logo and Name */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 cursor-pointer transform transition-transform duration-200 hover:scale-105"
        title="Go to Home"
      >
        <div className="bg-white rounded-full p-1">
          <img src={logo} alt="Logo" className="h-8 w-8 object-contain" /> {/* Slightly smaller logo */}
        </div>
        <span className="text-xl font-bold">GDC Automation</span> {/* Slightly smaller name */}
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6"> {/* Adjusted gap for smaller text */}
        <span
          onClick={() => navigate("/")}
          className={`relative cursor-pointer text-sm transition-colors duration-200 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-blue-500 after:transition-all after:duration-300 ${getActiveStyle("/")}`}
        >
          Home
        </span>
        <span
          onClick={() => navigate("/all-pipeline")}
          className={`relative cursor-pointer text-sm transition-colors duration-200 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-blue-500 after:transition-all after:duration-300 ${getActiveStyle("/all-pipeline")}`}
        >
          All Pipelines
        </span>
        <span
          onClick={() => navigate("/addpipeline")}
          className={`relative cursor-pointer text-sm transition-colors duration-200 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-blue-500 after:transition-all after:duration-300 ${getActiveStyle("/addpipeline")}`}
        >
          Add Pipeline
        </span>
        <span
          onClick={() => navigate("/logs")}
          className={`relative cursor-pointer text-sm transition-colors duration-200 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-blue-500 after:transition-all after:duration-300 ${getActiveStyle("/logs")}`}
        >
          Check Logs
        </span>
        <span className="text-xs text-gray-400">👤 Functional User</span> {/* Smaller user info */}
      </div>
    </header>
  );
}

export default Header;