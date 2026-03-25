import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">ATS Panel</h2>

        <ul className="space-y-4">
          <li className="text-blue-600 font-semibold">Dashboard</li>
          <li className="text-gray-600 hover:text-blue-600 cursor-pointer">
            Candidates
          </li>
          <li className="text-gray-600 hover:text-blue-600 cursor-pointer">
            Jobs
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
