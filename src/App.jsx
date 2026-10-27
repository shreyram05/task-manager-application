import { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import TaskManager from "./TaskManager";

function App() {
  const { user, logout } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("task-manager-theme") === "dark";
    } catch {
      return false;
    }
  });

  // Saving the application's theme preference
  useEffect(() => {
    try {
      localStorage.setItem("task-manager-theme", darkMode ? "dark" : "light");
    } catch {
      console.log("Could not save theme preference.");
    }
  }, [darkMode]);

  // Switch between light mode and dark mode
  function toggleTheme() {
    setDarkMode((previousMode) => !previousMode);
  }

  return (
    <div className={darkMode ? "dark min-h-screen" : "min-h-screen"}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
          />

          <Route
            path="/login"
            element={<Login darkMode={darkMode} toggleTheme={toggleTheme} />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-100 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">
                  <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-600">
                          Task Manager
                        </h1>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={toggleTheme}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          {darkMode ? "☀ Light mode" : "☾ Dark mode"}
                        </button>

                        <span className="hidden text-sm text-slate-600 sm:inline dark:text-slate-300">
                          Hi, {user?.username}!
                        </span>

                        <button
                          type="button"
                          onClick={logout}
                          className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-900"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </header>

                  <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
                    <TaskManager />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  );
}

export default App;
