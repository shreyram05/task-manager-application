import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Logout from "./Logout";
import Button from "./Button";

function Navbar({ darkMode, toggleTheme }) {
  const { user } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow dark:bg-slate-900">
      <h1 className="text-2xl font-bold dark:text-white">Task Manager</h1>

      <div className="flex items-center gap-4">
        <p className="dark:text-white">Hi, {user?.username}!</p>

        <Button
          variant="secondary"
          onClick={toggleTheme}
          className="border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {darkMode ? "☀ Light mode" : "☾ Dark mode"}
        </Button>

        <Logout />
      </div>
    </nav>
  );
}

export default Navbar;
