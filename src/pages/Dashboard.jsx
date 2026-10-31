import Navbar from "../components/Navbar";
import TaskManager from "../TaskManager";

function Dashboard({ darkMode, toggleTheme }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <Navbar
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      <TaskManager />
    </div>
  );
}

export default Dashboard;