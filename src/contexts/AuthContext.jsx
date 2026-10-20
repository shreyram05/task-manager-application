
import { createContext, useState } from "react";

export const AuthContext = createContext();

const ACCOUNTS_KEY = "task-manager-accounts";

function getSavedAccounts() {
  try {
    const savedAccounts = localStorage.getItem(ACCOUNTS_KEY);
    const accounts = savedAccounts ? JSON.parse(savedAccounts) : [];

    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

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

    setUser({ username: cleanUsername });

    return { success: true };
  }

  function login(username, password) {
    const accounts = getSavedAccounts();

    const matchingAccount = accounts.find(
      (account) =>
        account.username.toLowerCase() === username.trim().toLowerCase() &&
        account.password === password,
    );

    if (!matchingAccount) {
      return {
        success: false,
        error: "Incorrect username or password.",
      };
    }

    setUser({ username: matchingAccount.username });

    return { success: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

