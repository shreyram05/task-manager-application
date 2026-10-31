import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("task-manager-theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "task-manager-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            <Login
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/signup"
          element={
            <Signup
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                darkMode={darkMode}
                toggleTheme={toggleTheme}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;