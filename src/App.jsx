import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Candidates from "./components/Candidates";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "candidates":
        return <Candidates />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-black/40 backdrop-blur-lg p-6 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6">ATS Panel</h2>

        <ul className="space-y-4">
          {/* DASHBOARD */}
          <li
            onClick={() => setActivePage("dashboard")}
            className={`cursor-pointer ${
              activePage === "dashboard"
                ? "text-blue-400 font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </li>

          {/* CANDIDATES */}
          <li
            onClick={() => setActivePage("candidates")}
            className={`cursor-pointer ${
              activePage === "candidates"
                ? "text-blue-400 font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Candidates
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-auto">{renderPage()}</div>
    </div>
  );
}

export default App;
