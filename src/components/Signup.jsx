import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Button from "./Button";

function Signup({ darkMode, toggleTheme }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    const result = signup(username, password);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-900"
      >
        <div className="mb-5 flex justify-end">
          <Button
            variant="secondary"
            onClick={toggleTheme}
            className="border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {darkMode ? "☀ Light mode" : "☾ Dark mode"}
          </Button>
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold dark:text-white">
          Sign Up
        </h1>

        <p className="mb-6 text-center text-slate-500">Create your account</p>

        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          className="mb-4 w-full rounded-lg border p-3 dark:bg-slate-950 dark:text-white"
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="mb-5 w-full rounded-lg border p-3 dark:bg-slate-950 dark:text-white"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-700"
        >
          Sign Up
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-indigo-600"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Signup;
