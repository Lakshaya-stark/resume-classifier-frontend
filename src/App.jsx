import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      <div className="w-64 bg-black/40 backdrop-blur-lg p-6 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6">ATS Panel</h2>

        <ul className="space-y-4">
          <li className="text-blue-400 font-semibold">Dashboard</li>
          <li className="text-gray-400 hover:text-white cursor-pointer">
            Candidates
          </li>
          <li className="text-gray-400 hover:text-white cursor-pointer">
            Jobs
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
