import { createContext, useState } from "react";

export const AuthContext = createContext();
const ACCOUNTS_KEY = "task-manager-accounts";
const USER_KEY = "task-manager-user";

function getSavedAccounts() {
  try {
    const savedAccounts = localStorage.getItem(ACCOUNTS_KEY);
    const accounts = savedAccounts ? JSON.parse(savedAccounts) : [];

    if (!Array.isArray(accounts)) {
      return [];
    }

    return accounts.filter(
      (account) =>
        account &&
        typeof account.username === "string" &&
        typeof account.password === "string",
    );
  } catch {
    return [];
  }
}

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem(USER_KEY);
    if (!savedUser) {
      return null;
    }
    const user = JSON.parse(savedUser);
    const accounts = getSavedAccounts();
    const accountExists = accounts.some(
      (account) => account.username === user?.username,
    );

    if (accountExists) {
      return {
        username: user.username,
      };
    }
    localStorage.removeItem(USER_KEY);
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  function saveLogin(username) {
    const loggedInUser = { username };
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return true;
    } catch {
      return false;
    }
  }

  function signup(username, password) {
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      return {
        success: false,
        error: "Username must contain at least 3 characters.",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must contain at least 6 characters.",
      };
    }

    const accounts = getSavedAccounts();
    const accountExists = accounts.some(
      (account) =>
        account.username.toLowerCase() === cleanUsername.toLowerCase(),
    );
    if (accountExists) {
      return {
        success: false,
        error: "That username already exists. Please log in.",
      };
    }

    const newAccount = {
      username: cleanUsername,
      password,
    };

    try {
      localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify([...accounts, newAccount]),
      );
    } catch {
      return {
        success: false,
        error: "Unable to save this account in your browser.",
      };
    }

    if (!saveLogin(cleanUsername)) {
      return {
        success: false,
        error:
          "Account created, but the login session could not be saved. Please log in.",
      };
    }
    return {
      success: true,
    };
  }

  function login(username, password) {
    const cleanUsername = username.trim();
    const accounts = getSavedAccounts();
    const matchingAccount = accounts.find(
      (account) =>
        account.username.toLowerCase() === cleanUsername.toLowerCase() &&
        account.password === password,
    );

    if (!matchingAccount) {
      return {
        success: false,
        error: "Incorrect username or password.",
      };
    }

    if (!saveLogin(matchingAccount.username)) {
      return {
        success: false,
        error: "Unable to save your login session.",
      };
    }

    return {
      success: true,
    };
  }

  function logout() {
    try {
      localStorage.removeItem(USER_KEY);
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
