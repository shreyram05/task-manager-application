import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Login({ darkMode, toggleTheme }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const result = isSignup
      ? signup(username, password)
      : login(username, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate("/dashboard");
  }

  function switchMode() {
    setIsSignup((previousMode) => !previousMode);
    setError("");
    setPassword("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 transition-colors dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {darkMode ? "☀ Light mode" : "☾ Dark mode"}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
        >
          <div className="mb-6 text-center">

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isSignup ? "Create account" : "Welcome back"}
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {isSignup
                ? "Create an account to start managing your tasks."
                : "Log in to continue managing your tasks."}
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300"
            >
              {error}
            </p>
          )}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              required
              minLength={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-950"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-950"
            />

            {isSignup && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Use at least 6 characters for the password.
                </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {isSignup ? "Create account" : "Log in"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account yet?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;


